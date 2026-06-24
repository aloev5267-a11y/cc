import { NextRequest, NextResponse } from 'next/server'
import { getAdminUserByUsername, db } from '@/lib/db'
import { cookies } from 'next/headers'
import { 
  verifyPassword, 
  generateSessionToken, 
  generateSessionExpiry, 
  createSession, 
  deleteSession,
  validateSession 
} from '@/lib/auth'
import { rateLimit, rateLimitConfigs, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    // Throttle brute-force attempts per IP + username before hitting bcrypt.
    const ip = getClientIp(request)
    const limit = rateLimit(`admin-login:${ip}:${String(username).toLowerCase()}`, rateLimitConfigs.adminLogin)
    if (!limit.success) {
      const retryAfter = Math.max(0, Math.ceil((limit.resetTime - Date.now()) / 1000))
      return NextResponse.json(
        { error: 'Too many login attempts. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const user = getAdminUserByUsername(username) as { 
      id: string
      username: string
      password_hash: string
      role: string 
    } | undefined
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password with bcrypt
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create secure session token and store in database
    const sessionToken = generateSessionToken()
    const expiresAt = generateSessionExpiry(24) // 24 hours
    
    const database = db()
    createSession(database, user.id, sessionToken, expiresAt)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })

    // Set session cookie with the token
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    
    if (sessionToken) {
      const database = db()
      deleteSession(database, sessionToken)
    }
    
    cookieStore.delete('admin_session')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - Validate current session
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    const database = db()
    const session = validateSession(database, sessionToken)
    
    if (!session) {
      cookieStore.delete('admin_session')
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    
    return NextResponse.json({ 
      authenticated: true,
      userId: session.userId 
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
