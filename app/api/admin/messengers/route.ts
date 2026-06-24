import { NextRequest, NextResponse } from 'next/server'
import { getAllMessengerAccounts, addMessengerAccount, updateMessengerAccount, deleteMessengerAccount, logActivity } from '@/lib/db'
import { checkAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const messengerType = searchParams.get('type')

    const accounts = getAllMessengerAccounts(messengerType || undefined)
    return NextResponse.json({ success: true, accounts })
  } catch (error) {
    console.error('Get messenger accounts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messenger_type, account_id, account_name, order_index } = await request.json()
    
    if (!messenger_type || !account_id || !account_name) {
      return NextResponse.json({ error: 'Messenger type, account ID, and name required' }, { status: 400 })
    }

    if (!['telegram', 'whatsapp', 'max'].includes(messenger_type)) {
      return NextResponse.json({ error: 'Invalid messenger type' }, { status: 400 })
    }

    const id = `${messenger_type}_${Date.now()}`
    addMessengerAccount(id, messenger_type, account_id, account_name, order_index || 0)
    logActivity('messenger_account_created', 'messenger', id, adminId, JSON.stringify({ messenger_type, account_id, account_name }))

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Create messenger account error:', error)
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
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
    }

    updateMessengerAccount(id, data)
    logActivity('messenger_account_updated', 'messenger', id, adminId, JSON.stringify(data))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update messenger account error:', error)
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
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
    }

    deleteMessengerAccount(id)
    logActivity('messenger_account_deleted', 'messenger', id, adminId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete messenger account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
