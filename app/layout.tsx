import { StructuredData } from "@/components/structured-data"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { YandexMetrika } from '@/components/yandex-metrika'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
  display: 'swap'
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: '--font-jetbrains',
  display: 'swap'
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ccourierhub.ru'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'КурьерХаб — Курьерская доставка грузов и посылок по всей России',
    template: '%s | КурьерХаб'
  },
  description: 'КурьерХаб — курьерская служба для быстрой и надёжной доставки грузов и посылок по всей России. Оформление за минуту, 14 регионов, поддержка 24/7.',
  keywords: ['курьерская доставка','доставка грузов','доставка посылок','курьерская служба','экспресс доставка','доставка по России','логистика','грузоперевозки','КурьерХаб','доставка Москва','доставка СПб','отправить посылку','доставка день в день'],
  authors: [{ name: 'ООО "Фестивальное движение Феникс"', url: siteUrl }],
  creator: 'КурьерХаб',
  publisher: 'ООО "Фестивальное движение Феникс"',
  formatDetection: { email: true, address: true, telephone: true },
  verification: { yandex: '3ddb5b26f1ccf934' },
  alternates: { canonical: '/', languages: { 'ru-RU': '/' } },
  icons: { icon: [{ url: '/logo.webp', type: 'image/webp' },{ url: '/logo.jpg', type: 'image/jpeg' }], apple: '/logo.jpg', shortcut: '/logo.webp' },
  manifest: '/manifest.json',
  openGraph: { type: 'website', locale: 'ru_RU', url: siteUrl, siteName: 'КурьерХаб', title: 'КурьерХаб — Курьерская доставка по всей России', description: 'Курьерская служба для быстрой доставки грузов и посылок по России. Оформи доставку за минуту. 14 регионов, поддержка 24/7.', images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'КурьерХаб — курьерская доставка грузов и посылок', type: 'image/png' }] },
  twitter: { card: 'summary_large_image', title: 'КурьерХаб — Курьерская доставка по России', description: 'Курьерская служба для быстрой доставки грузов и посылок. Оформи доставку за минуту.', images: [`${siteUrl}/og-image.png`], creator: '@ccourierhub' },
  robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, noimageindex: false, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  category: 'logistics',
}

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f97316' },{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }],
  width: 'device-width', initialScale: 1, maximumScale: 5, userScalable: true, colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="bg-background scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <meta name="geo.region" content="RU" />
        <meta name="geo.placename" content="Россия" />
        <meta name="application-name" content="КурьерХаб" />
        <meta name="apple-mobile-web-app-title" content="КурьерХаб" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <StructuredData />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}>
        <YandexMetrika />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
