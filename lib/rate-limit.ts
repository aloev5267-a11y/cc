// Simple in-memory rate limiter for VPS deployment
// Uses sliding window algorithm

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
let cleanupInterval: ReturnType<typeof setInterval> | null = null

function startCleanup() {
  if (cleanupInterval) return
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
  
  // Prevent interval from keeping process alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref()
  }
}

// Start cleanup on first use
startCleanup()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60 * 1000, maxRequests: 30 }
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  const entry = rateLimitStore.get(key)

  // If no entry or entry expired, create new one
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment counter
  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

// Predefined rate limit configs
export const rateLimitConfigs = {
  // API endpoints
  chatCreate: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 chats per minute
  chatSend: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 messages per minute
  chatMessages: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 polls per minute (for long polling)
  
  // Admin endpoints (stricter)
  admin: { windowMs: 60 * 1000, maxRequests: 10 },

  // Admin login (very strict to slow down brute-force on passwords)
  adminLogin: { windowMs: 5 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 5 minutes
  
  // Contact form
  contact: { windowMs: 60 * 1000, maxRequests: 3 }, // 3 submissions per minute
  
  // Telegram webhook (more permissive for incoming messages)
  telegramWebhook: { windowMs: 60 * 1000, maxRequests: 100 },
} as const

// Helper to get client IP from request.
// On a VPS behind nginx, configure the reverse proxy to set a trusted header
// (e.g. `proxy_set_header X-Real-IP $remote_addr;`). We prefer X-Real-IP because
// it is set by the trusted proxy from the real connection and cannot be spoofed
// by the client, unlike X-Forwarded-For which the client can prepend to.
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // Fallback: take the left-most entry of X-Forwarded-For. Note this is
  // spoofable unless a trusted proxy overwrites the header, so X-Real-IP above
  // should always be preferred in production.
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Fallback to a default identifier
  return 'unknown'
}

// Rate limit middleware helper
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig,
  identifier?: string
): RateLimitResult {
  const ip = identifier || getClientIp(request)
  return rateLimit(ip, config)
}
