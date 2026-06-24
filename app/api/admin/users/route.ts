import { NextRequest, NextResponse } from 'next/server'
import { getAllAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, logActivity } from '@/lib/db'
import { checkAdminRole } from '@/lib/admin-auth'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    const adminId = await checkAdminRole()
    if (!adminId) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const users = await getAllAdminUsers()
    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Get admin users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await checkAdminRole()
    if (!adminId) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { username, password, role, telegram_id } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const id = `user_${Date.now()}`
    const passwordHash = await hashPassword(password)
    await createAdminUser(id, username, passwordHash, role || 'operator', telegram_id)
    await logActivity('admin_user_created', 'admin_user', id, adminId, JSON.stringify({ username, role }))

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Create admin user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await checkAdminRole()
    if (!adminId) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id, password, ...data } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const updateData = { ...data } as { password_hash?: string; [key: string]: unknown }
    if (password) {
      updateData.password_hash = await hashPassword(password)
    }

    await updateAdminUser(id, updateData)
    await logActivity('admin_user_updated', 'admin_user', id, adminId, JSON.stringify(data))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update admin user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminId = await checkAdminRole()
    if (!adminId) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (id === adminId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    await deleteAdminUser(id)
    await logActivity('admin_user_deleted', 'admin_user', id, adminId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete admin user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
