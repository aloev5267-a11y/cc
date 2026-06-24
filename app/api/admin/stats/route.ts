import { NextResponse } from 'next/server'
import { getLeadStats, getAllChats, getActivityLog, getAllManagers, getAllMessengerAccounts, getRecentLeads } from '@/lib/db'
import { checkAdminAuth } from '@/lib/admin-auth'

export async function GET() {
  try {
    const adminId = await checkAdminAuth()
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [leadStats, chats, managers, messengerAccounts, recentActivity, recentLeads] =
      await Promise.all([
        getLeadStats(),
        getAllChats(),
        getAllManagers(),
        getAllMessengerAccounts(),
        getActivityLog(20),
        getRecentLeads(30),
      ])

    const stats = {
      leads: leadStats,
      recentLeads,
      chats: {
        total: chats.length,
        active: chats.filter(c => c.status === 'active').length,
        waiting: chats.filter(c => c.status === 'waiting').length,
        closed: chats.filter(c => c.status === 'closed').length,
      },
      managers: {
        total: managers.length,
        active: managers.filter(m => m.is_available === 1).length,
      },
      messengers: {
        telegram: messengerAccounts.filter(a => a.messenger_type === 'telegram').length,
        whatsapp: messengerAccounts.filter(a => a.messenger_type === 'whatsapp').length,
        max: messengerAccounts.filter(a => a.messenger_type === 'max').length,
        activeTotal: messengerAccounts.filter(a => a.is_active === 1).length,
      },
      recentActivity,
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
