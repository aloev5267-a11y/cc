import { NextRequest, NextResponse } from 'next/server'
import { getAllManagers, addManager, updateManager, deleteManager, logActivity } from '@/lib/db'
import { checkAdminAuth } from '@/lib/admin-auth'

export async function GET() {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const managers = getAllManagers()
    return NextResponse.json({ success: true, managers })
  } catch (error) {
    console.error('Get managers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { telegram_id, name, order_index } = await request.json()
    
    if (!telegram_id || !name) {
      return NextResponse.json({ error: 'Telegram ID and name required' }, { status: 400 })
    }

    const id = `manager_${Date.now()}`
    addManager(id, telegram_id, name, order_index || 0)
    logActivity('manager_created', 'manager', id, adminId, JSON.stringify({ telegram_id, name }))

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Create manager error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...data } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Manager ID required' }, { status: 400 })
    }

    updateManager(id, data)
    logActivity('manager_updated', 'manager', id, adminId, JSON.stringify(data))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update manager error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Manager ID required' }, { status: 400 })
    }

    deleteManager(id)
    logActivity('manager_deleted', 'manager', id, adminId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete manager error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
