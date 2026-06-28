"use client"

import { useState, useEffect } from "react"
import { siteConfig } from "@/lib/config"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  IconUsers,
  IconTelegram,
  IconVk,
  IconWhatsapp,
  IconMax,
  IconMessage,
  IconChart,
  IconSettings,
  IconLogout,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
  IconArrow,
} from "@/components/icons"
import { MarketingGuide } from "@/components/admin/marketing-guide"

type Tab = "dashboard" | "managers" | "messengers" | "users" | "settings" | "guide"

interface Manager {
  id: string
  telegram_id: string
  name: string
  is_available: number
  order_index: number
}

interface MessengerAccount {
  id: string
  messenger_type: string
  account_id: string
  account_name: string
  is_active: number
  order_index: number
  total_leads: number
}

interface AdminUser {
  id: string
  username: string
  role: string
  telegram_id: string | null
  is_active: number
}

interface Stats {
  leads: {
    total: number
    today: number
    bySource: Array<{ source: string; count: number }>
    byStatus: Array<{ status: string; count: number }>
  }
  managers: {
    total: number
    active: number
  }
  messengers: {
    telegram: number
    vk: number
    whatsapp: number
    max: number
    activeTotal: number
  }
  recentActivity: Array<{
    id: number
    action: string
    entity_type: string
    details: string
    created_at: string
  }>
  recentLeads: Array<{
    id: number
    client_id: string
    source: string
    status: string
    metadata: string | null
    created_at: string
  }>
}

// Helper function to make authenticated fetch requests
async function authFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
  })
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [stats, setStats] = useState<Stats | null>(null)
  const [managers, setManagers] = useState<Manager[]>([])
  const [messengerAccounts, setMessengerAccounts] = useState<MessengerAccount[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  
  // Login form
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await authFetch("/api/admin/stats")
      if (res.ok) {
        setIsAuthenticated(true)
        const data = await res.json()
        setStats(data.stats)
      }
    } catch {
      // Not authenticated
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    
    try {
      const res = await authFetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      
      if (res.ok) {
        setIsAuthenticated(true)
        loadDashboard()
      } else {
        const data = await res.json()
        setLoginError(data.error || "Login failed")
      }
    } catch {
      setLoginError("Connection error")
    }
  }

  async function handleLogout() {
    await authFetch("/api/admin/auth", { method: "DELETE" })
    setIsAuthenticated(false)
  }

  async function loadDashboard() {
    const res = await authFetch("/api/admin/stats")
    if (res.ok) {
      const data = await res.json()
      setStats(data.stats)
    }
  }

  async function loadManagers() {
    const res = await authFetch("/api/admin/managers")
    if (res.ok) {
      const data = await res.json()
      setManagers(data.managers)
    }
  }

  async function loadMessengers() {
    const res = await authFetch("/api/admin/messengers")
    if (res.ok) {
      const data = await res.json()
      setMessengerAccounts(data.accounts)
    }
  }

  async function loadUsers() {
    const res = await authFetch("/api/admin/users")
    if (res.ok) {
      const data = await res.json()
      setAdminUsers(data.users)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "dashboard") void loadDashboard()
      else if (activeTab === "managers") void loadManagers()
      else if (activeTab === "messengers") void loadMessengers()
      else if (activeTab === "users") void loadUsers()
    }
  }, [activeTab, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                <Image src="/logo.png" alt={siteConfig.name} fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{siteConfig.name}</h1>
                <p className="text-xs text-muted-foreground">Панель управления</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Логин</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
                  placeholder="********"
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Войти
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
              <Image src="/logo.png" alt={siteConfig.name} fill className="object-cover" />
            </div>
            <div>
              <h1 className="font-bold">{siteConfig.name}</h1>
              <p className="text-xs text-muted-foreground">Админ-панель</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "dashboard" as Tab, label: "Дашборд", icon: IconChart },
            { id: "managers" as Tab, label: "Менеджеры чата", icon: IconMessage },
            { id: "messengers" as Tab, label: "Мессенджеры", icon: IconTelegram },
            { id: "users" as Tab, label: "Пользователи", icon: IconUsers },
            { id: "guide" as Tab, label: "Гайд по рекламе", icon: IconChart },
            { id: "settings" as Tab, label: "Настройки", icon: IconSettings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <IconLogout className="w-5 h-5" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <DashboardTab stats={stats} key="dashboard" />
          )}
          {activeTab === "managers" && (
            <ManagersTab managers={managers} onRefresh={loadManagers} key="managers" />
          )}
          {activeTab === "messengers" && (
            <MessengersTab accounts={messengerAccounts} onRefresh={loadMessengers} key="messengers" />
          )}
          {activeTab === "users" && (
            <UsersTab users={adminUsers} onRefresh={loadUsers} key="users" />
          )}
          {activeTab === "guide" && (
            <MarketingGuide key="guide" />
          )}
          {activeTab === "settings" && (
            <SettingsTab key="settings" />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// Dashboard Tab
function DashboardTab({ stats }: { stats: Stats | null }) {
  if (!stats) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Дашборд</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Лиды сегодня"
          value={stats.leads.today}
          icon={<IconArrow className="w-5 h-5 rotate-45" />}
          color="primary"
        />
        <StatCard
          title="Всего лидов"
          value={stats.leads.total}
          icon={<IconUsers className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Активные мессенджеры"
          value={stats.messengers.activeTotal}
          icon={<IconMessage className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Менеджеров онлайн"
          value={`${stats.managers.active}/${stats.managers.total}`}
          icon={<IconCheck className="w-5 h-5" />}
          color="orange"
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Лиды по источникам</h3>
          <div className="space-y-3">
            {stats.leads.bySource.map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <span className="capitalize">{item.source}</span>
                <span className="font-mono font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Мессенджеры</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-xl">
              <IconTelegram className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="font-bold text-2xl">{stats.messengers.telegram}</div>
              <div className="text-xs text-muted-foreground">Telegram</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl">
              <IconVk className="w-8 h-8 mx-auto mb-2 text-[#0077FF]" />
              <div className="font-bold text-2xl">{stats.messengers.vk}</div>
              <div className="text-xs text-muted-foreground">ВКонтакте</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl">
              <IconWhatsapp className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="font-bold text-2xl">{stats.messengers.whatsapp}</div>
              <div className="text-xs text-muted-foreground">WhatsApp</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl">
              <IconMax className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold text-2xl">{stats.messengers.max}</div>
              <div className="text-xs text-muted-foreground">MAX</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Заявки с промо-страниц</h3>
        {stats.recentLeads.filter((l) => l.metadata).length === 0 ? (
          <p className="text-sm text-muted-foreground">Заявок с данными опроса пока нет.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentLeads
              .filter((l) => l.metadata)
              .slice(0, 15)
              .map((lead) => {
                let fields: Record<string, string> = {}
                try {
                  fields = lead.metadata ? JSON.parse(lead.metadata) : {}
                } catch {
                  fields = {}
                }
                return (
                  <div key={lead.id} className="rounded-xl border border-border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {lead.source}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleString("ru")}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{lead.status}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(fields).map(([key, value]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs"
                        >
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-semibold">{value}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      <div className="mt-6 bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Последняя активность</h3>
        <div className="space-y-2">
          {stats.recentActivity.slice(0, 10).map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm">{item.action}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleString("ru")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    orange: "bg-orange-500/10 text-orange-500",
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  )
}

// Managers Tab
function ManagersTab({ managers, onRefresh }: { managers: Manager[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ telegram_id: "", name: "", order_index: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const method = editingId ? "PUT" : "POST"
    const body = editingId ? { id: editingId, ...formData } : formData

    await authFetch("/api/admin/managers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setShowForm(false)
    setEditingId(null)
    setFormData({ telegram_id: "", name: "", order_index: 0 })
    onRefresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить менеджера?")) return
    await authFetch(`/api/admin/managers?id=${id}`, { method: "DELETE" })
    onRefresh()
  }

  async function toggleAvailability(id: string, currentValue: number) {
    await authFetch("/api/admin/managers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_available: currentValue === 0 }),
    })
    onRefresh()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Менеджеры чата</h2>
          <p className="text-muted-foreground">Управление менеджерами онлайн-чата</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          <IconPlus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Имя</th>
              <th className="text-left px-4 py-3 font-medium">Telegram ID</th>
              <th className="text-left px-4 py-3 font-medium">Порядок</th>
              <th className="text-left px-4 py-3 font-medium">Статус</th>
              <th className="text-right px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{manager.name}</td>
                <td className="px-4 py-3 font-mono text-sm">{manager.telegram_id}</td>
                <td className="px-4 py-3">{manager.order_index}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAvailability(manager.id, manager.is_available)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      manager.is_available
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {manager.is_available ? "Активен" : "Неактивен"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData({
                          telegram_id: manager.telegram_id,
                          name: manager.name,
                          order_index: manager.order_index,
                        })
                        setEditingId(manager.id)
                        setShowForm(true)
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(manager.id)}
                      className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">
                {editingId ? "Редактировать" : "Добавить"} менеджера
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telegram ID</label>
                  <input
                    type="text"
                    value={formData.telegram_id}
                    onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    placeholder="123456789"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Порядок в очереди</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-muted rounded-xl font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Messengers Tab
function MessengersTab({ accounts, onRefresh }: { accounts: MessengerAccount[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ messenger_type: "telegram", account_id: "", account_name: "", order_index: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const method = editingId ? "PUT" : "POST"
    const body = editingId ? { id: editingId, ...formData } : formData

    await authFetch("/api/admin/messengers", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setShowForm(false)
    setEditingId(null)
    setFormData({ messenger_type: "telegram", account_id: "", account_name: "", order_index: 0 })
    onRefresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить аккаунт?")) return
    await authFetch(`/api/admin/messengers?id=${id}`, { method: "DELETE" })
    onRefresh()
  }

  async function toggleActive(id: string, currentValue: number) {
    await authFetch("/api/admin/messengers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: currentValue === 0 }),
    })
    onRefresh()
  }

    const messengerGroups = {
      telegram: accounts.filter(a => a.messenger_type === "telegram"),
      vk: accounts.filter(a => a.messenger_type === "vk"),
      whatsapp: accounts.filter(a => a.messenger_type === "whatsapp"),
      max: accounts.filter(a => a.messenger_type === "max"),
    }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Аккаунты мессенджеров</h2>
          <p className="text-muted-foreground">Настройка round-robin распределения лидов</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          <IconPlus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="space-y-6">
        {(["telegram", "vk", "whatsapp", "max"] as const).map((type) => (
          <div key={type} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-muted flex items-center gap-3">
              {type === "telegram" && <IconTelegram className="w-5 h-5 text-blue-500" />}
              {type === "vk" && <IconVk className="w-5 h-5 text-[#0077FF]" />}
              {type === "whatsapp" && <IconWhatsapp className="w-5 h-5 text-green-500" />}
              {type === "max" && <IconMax className="w-5 h-5" />}
              <span className="font-bold capitalize">{type === "vk" ? "ВКонтакте" : type}</span>
              <span className="text-sm text-muted-foreground">({messengerGroups[type].length} аккаунтов)</span>
            </div>
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2 text-sm font-medium">Имя</th>
                  <th className="text-left px-4 py-2 text-sm font-medium">ID/Username</th>
                  <th className="text-left px-4 py-2 text-sm font-medium">Порядок</th>
                  <th className="text-left px-4 py-2 text-sm font-medium">Лиды</th>
                  <th className="text-left px-4 py-2 text-sm font-medium">Статус</th>
                  <th className="text-right px-4 py-2 text-sm font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {messengerGroups[type].length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Нет аккаунтов
                    </td>
                  </tr>
                ) : (
                  messengerGroups[type].map((account) => (
                    <tr key={account.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{account.account_name}</td>
                      <td className="px-4 py-3 font-mono text-sm">{account.account_id}</td>
                      <td className="px-4 py-3">{account.order_index}</td>
                      <td className="px-4 py-3">{account.total_leads}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(account.id, account.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            account.is_active
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {account.is_active ? "Активен" : "Неактивен"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setFormData({
                                messenger_type: account.messenger_type,
                                account_id: account.account_id,
                                account_name: account.account_name,
                                order_index: account.order_index,
                              })
                              setEditingId(account.id)
                              setShowForm(true)
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <IconEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">
                {editingId ? "Редактировать" : "Добавить"} аккаунт
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Мессенджер</label>
                  <select
                    value={formData.messenger_type}
                    onChange={(e) => setFormData({ ...formData, messenger_type: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    disabled={!!editingId}
                  >
                    <option value="telegram">Telegram</option>
                    <option value="vk">ВКонтакте</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="max">MAX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    placeholder="Менеджер 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {formData.messenger_type === "telegram"
                      ? "Username (без @)"
                      : formData.messenger_type === "vk"
                        ? "Адрес сообщества или ID"
                        : "Номер телефона"}
                  </label>
                  <input
                    type="text"
                    value={formData.account_id}
                    onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    placeholder={
                      formData.messenger_type === "telegram"
                        ? "username"
                        : formData.messenger_type === "vk"
                          ? "elwork или 123456789"
                          : "79001234567"
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Порядок в очереди</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-muted rounded-xl font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Users Tab
function UsersTab({ users, onRefresh }: { users: AdminUser[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ username: "", password: "", role: "operator", telegram_id: "" })
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const method = editingId ? "PUT" : "POST"
    const body = editingId ? { id: editingId, ...formData } : formData

    await authFetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setShowForm(false)
    setEditingId(null)
    setFormData({ username: "", password: "", role: "operator", telegram_id: "" })
    onRefresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить пользователя?")) return
    await authFetch(`/api/admin/users?id=${id}`, { method: "DELETE" })
    onRefresh()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Пользователи админ-панели</h2>
          <p className="text-muted-foreground">Управление доступом к админке</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          <IconPlus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Логин</th>
              <th className="text-left px-4 py-3 font-medium">Роль</th>
              <th className="text-left px-4 py-3 font-medium">Telegram ID</th>
              <th className="text-left px-4 py-3 font-medium">Статус</th>
              <th className="text-right px-4 py-3 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{user.username}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted"
                  }`}>
                    {user.role === "admin" ? "Админ" : "Оператор"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm">{user.telegram_id || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.is_active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}>
                    {user.is_active ? "Активен" : "Неактивен"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData({
                          username: user.username,
                          password: "",
                          role: user.role,
                          telegram_id: user.telegram_id || "",
                        })
                        setEditingId(user.id)
                        setShowForm(true)
                      }}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4">
                {editingId ? "Редактировать" : "Добавить"} пользователя
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Логин</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Пароль {editingId && "(оставьте пустым чтобы не менять)"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    required={!editingId}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Роль</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                  >
                    <option value="operator">Оператор</option>
                    <option value="admin">Админ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telegram ID (опционально)</label>
                  <input
                    type="text"
                    value={formData.telegram_id}
                    onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:outline-none"
                    placeholder="123456789"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 bg-muted rounded-xl font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Settings Tab
function SettingsTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
      <h2 className="text-2xl font-bold mb-6">Настройки</h2>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Telegram Bot</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Настройте Telegram бота для получения сообщений из онлайн-чата.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Webhook URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typeof window !== 'undefined' ? `${window.location.origin}/api/telegram/webhook` : ''}
                  readOnly
                  className="flex-1 px-4 py-3 bg-muted rounded-xl border border-border font-mono text-sm"
                />
                <button className="px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium">
                  Копировать
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">Как это работает</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">Менеджеры чата:</strong>
              <p>Когда клиент пишет в онлайн-чат, сообщение отправляется следующему менеджеру по очереди (round-robin). Если клиент уже общался с менеджером ранее, сообщение идёт ему же.</p>
            </div>
            <div>
              <strong className="text-foreground">Мессенджеры:</strong>
              <p>При клике на Telegram/WhatsApp/MAX, клиент перенаправляется на следующий аккаунт по очереди. Если клиент уже переходил ранее, он попадает на тот же аккаунт.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
