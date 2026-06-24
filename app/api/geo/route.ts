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

// Кэш гео-данных по IP в памяти процесса, чтобы не дёргать внешний гео-сервис
// на каждый заход одного и того же посетителя. TTL — 24 часа.
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const GEO_CACHE_MAX = 5000
type GeoData = { country: string | null; city: string | null }
const geoCache = new Map<string, { data: GeoData; expires: number }>()

function getCachedGeo(ip: string): GeoData | undefined {
  const hit = geoCache.get(ip)
  if (!hit) return undefined
  if (hit.expires < Date.now()) {
    geoCache.delete(ip)
    return undefined
  }
  return hit.data
}

function setCachedGeo(ip: string, data: GeoData): void {
  // Простейшая защита от безграничного роста: чистим самые старые записи.
  if (geoCache.size >= GEO_CACHE_MAX) {
    const oldestKey = geoCache.keys().next().value
    if (oldestKey !== undefined) geoCache.delete(oldestKey)
  }
  geoCache.set(ip, { data, expires: Date.now() + GEO_CACHE_TTL_MS })
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

async function lookupGeo(ip: string): Promise<GeoData> {
  // Основной сервис: freeipapi.com (бесплатно, без ключа, по HTTPS) — отдаёт и страну, и город.
  try {
    const res = await fetch(`https://freeipapi.com/api/json/${ip}`, {
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const data = (await res.json()) as { countryCode?: string; cityName?: string }
      if (data.countryCode && /^[A-Z]{2}$/i.test(data.countryCode)) {
        return {
          country: data.countryCode.toUpperCase(),
          city: data.cityName?.trim() || null,
        }
      }
    }
  } catch {
    // основной сервис недоступен — пробуем запасной
  }

  // Запасной сервис: api.country.is — только страна, без города.
  try {
    const res = await fetch(`https://api.country.is/${ip}`, {
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const data = (await res.json()) as { country?: string }
      if (data.country && /^[A-Z]{2}$/i.test(data.country)) {
        return { country: data.country.toUpperCase(), city: null }
      }
    }
  } catch {
    // оба HTTPS-сервиса недоступны
  }

  return { country: null, city: null }
}

export async function GET(request: NextRequest) {
  // 1) Если перед сайтом всё же стоит Cloudflare — используем его заголовки (мгновенно, без запросов).
  const cfCountry = request.headers.get("cf-ipcountry")
  const cfCity = request.headers.get("cf-ipcity")
  if (cfCountry && cfCountry !== "XX" && /^[A-Z]{2}$/i.test(cfCountry)) {
    const country = cfCountry.toUpperCase()
    const city = cfCity ? decodeURIComponent(cfCity) : null
    return NextResponse.json({ country, city, isRussia: country === "RU" })
  }

  // 2) Иначе берём реальный IP клиента и спрашиваем гео-сервис.
  const ip = getClientIp(request)

  if (!ip || isPrivateIp(ip)) {
    // Локальная разработка или IP не определить — считаем, что не Россия.
    return NextResponse.json({ country: null, city: null, isRussia: false })
  }

  // Отдаём из кэша, если IP уже спрашивали недавно.
  const cached = getCachedGeo(ip)
  if (cached !== undefined) {
    return NextResponse.json({ ...cached, isRussia: cached.country === "RU" })
  }

  const geo = await lookupGeo(ip)
  // Кэшируем только успешный ответ. Если оба сервиса временно недоступны
  // (country === null), не запоминаем сбой — чтобы при следующем заходе
  // попробовать снова, а не считать посетителя «не из РФ» сутки.
  if (geo.country !== null) {
    setCachedGeo(ip, geo)
  }
  return NextResponse.json({ ...geo, isRussia: geo.country === "RU" })
}
