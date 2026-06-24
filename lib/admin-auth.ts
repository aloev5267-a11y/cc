import { cookies } from 'next/headers'
import { dbQueryOne } from './db'
import { validateSession } from './auth'

/**
 * Check if the current request has a valid admin session.
 * Validates the session token from cookies against the database.
 *
 * @returns User ID if authenticated, null otherwise
 */
export async function checkAdminAuth(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    const session = await validateSession(sessionToken)

    if (!session) {
      return null
    }

    return session.userId
  } catch (error) {
    console.error('Admin auth check error:', error)
    return null
  }
}

/**
 * Check if the current request has admin role (not just operator).
 *
 * @returns User ID if admin, null otherwise
 */
export async function checkAdminRole(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    const session = await validateSession(sessionToken)

    if (!session) {
      return null
    }

    // Check if user has admin role
    const user = await dbQueryOne<{ role: string }>(
      'SELECT role FROM admin_users WHERE id = $1 AND is_active = 1',
      [session.userId],
    )

    if (!user || user.role !== 'admin') {
      return null
    }

    return session.userId
  } catch (error) {
    console.error('Admin role check error:', error)
    return null
  }
}
