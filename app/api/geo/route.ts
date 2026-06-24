import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Определение страны посетителя на собственной VPS.
// Платформенных заголовков (x-vercel-ip-country) тут нет, поэтому берём реальный IP
// клиента из заголовков прокси (nginx) и спрашиваем страну у бесплатного geo-сервиса.
export const dynamic = "force-dynamic"

// Достаём реальный IP клиента. За nginx обычно приходит X-Forwarded-For:
// "реальный_ip, прокси1, прокси2" — берём самый первый адрес.
function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  return req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || null
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
    // второй сервис недоступен — пробуем третий
  }

  // Третий запасной: ip-api.com (бесплатно, до 45 запросов/мин, по HTTP).
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const data = (await res.json()) as { status?: string; countryCode?: string }
      if (data.status === "success" && data.countryCode) {
        return data.countryCode.toUpperCase()
      }
    }
  } catch {
    // ignore
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

  const country = await lookupCountry(ip)
  return NextResponse.json({ country, isRussia: country === "RU" })
}
