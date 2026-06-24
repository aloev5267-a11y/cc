import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Определение страны посетителя на собственной VPS.
// Платформенных заголовков (x-vercel-ip-country) тут нет, поэтому берём реальный IP
// клиента из заголовков прокси (nginx) и спрашиваем страну у бесплатного geo-сервиса.
export const dynamic = "force-dynamic"

// Достаём реальный IP клиента. На VPS за nginx надёжнее всего X-Real-IP
// (его выставляет доверенный прокси из реального соединения и подделать нельзя),
// а X-Forwarded-For клиент может подменить, поэтому он идёт запасным вариантом.
function getClientIp(req: NextRequest): string | null {
  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  const cf = req.headers.get("cf-connecting-ip")
  if (cf) return cf.trim()

  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  return null
}

// Кэш страны по IP в памяти процесса, чтобы не дёргать внешний гео-сервис
// на каждый заход одного и того же посетителя. TTL — 24 часа.
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const GEO_CACHE_MAX = 5000
const geoCache = new Map<string, { country: string | null; expires: number }>()

function getCachedCountry(ip: string): string | null | undefined {
  const hit = geoCache.get(ip)
  if (!hit) return undefined
  if (hit.expires < Date.now()) {
    geoCache.delete(ip)
    return undefined
  }
  return hit.country
}

function setCachedCountry(ip: string, country: string | null): void {
  // Простейшая защита от безграничного роста: чистим самые старые записи.
  if (geoCache.size >= GEO_CACHE_MAX) {
    const oldestKey = geoCache.keys().next().value
    if (oldestKey !== undefined) geoCache.delete(oldestKey)
  }
  geoCache.set(ip, { country, expires: Date.now() + GEO_CACHE_TTL_MS })
}

// Приватные/локальные адреса — гео-сервис для них спрашивать бессмысленно.
function isPrivateIp(ip: string): boolean {
  const addr = ip.replace(/^::ffff:/, "")
  return (
    addr === "127.0.0.1" ||
    addr === "::1" ||
    addr.startsWith("10.") ||
    addr.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(addr) ||
    addr.startsWith("fc") ||
    addr.startsWith("fd")
  )
}

async function lookupCountry(ip: string): Promise<string | null> {
  // api.country.is — бесплатно, без ключа, по HTTPS, простой и быстрый ответ {ip, country}.
  try {
    const res = await fetch(`https://api.country.is/${ip}`, {
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const data = (await res.json()) as { country?: string }
      if (data.country && /^[A-Z]{2}$/i.test(data.country)) {
        return data.country.toUpperCase()
      }
    }
  } catch {
    // основной сервис недоступен — пробуем запасной
  }

  // Запасной сервис: freeipapi.com (бесплатно, без ключа, по HTTPS).
  try {
    const res = await fetch(`https://freeipapi.com/api/json/${ip}`, {
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const data = (await res.json()) as { countryCode?: string }
      if (data.countryCode && /^[A-Z]{2}$/i.test(data.countryCode)) {
        return data.countryCode.toUpperCase()
      }
    }
  } catch {
    // оба HTTPS-сервиса недоступны
  }

  return null
}

export async function GET(request: NextRequest) {
  // 1) Если перед сайтом всё же стоит Cloudflare — используем его заголовок (мгновенно, без запросов).
  const cfCountry = request.headers.get("cf-ipcountry")
  if (cfCountry && cfCountry !== "XX" && /^[A-Z]{2}$/i.test(cfCountry)) {
    const country = cfCountry.toUpperCase()
    return NextResponse.json({ country, isRussia: country === "RU" })
  }

  // 2) Иначе берём реальный IP клиента и спрашиваем гео-сервис.
  const ip = getClientIp(request)

  if (!ip || isPrivateIp(ip)) {
    // Локальная разработка или IP не определить — считаем, что не Россия.
    return NextResponse.json({ country: null, isRussia: false })
  }

  // Отдаём из кэша, если IP уже спрашивали недавно.
  const cached = getCachedCountry(ip)
  if (cached !== undefined) {
    return NextResponse.json({ country: cached, isRussia: cached === "RU" })
  }

  const country = await lookupCountry(ip)
  // Кэшируем только успешный ответ. Если оба сервиса временно недоступны
  // (country === null), не запоминаем сбой — чтобы при следующем заходе
  // попробовать снова, а не считать посетителя «не из РФ» сутки.
  if (country !== null) {
    setCachedCountry(ip, country)
  }
  return NextResponse.json({ country, isRussia: country === "RU" })
}
