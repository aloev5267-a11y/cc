import { StructuredData } from "@/components/structured-data"
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { YandexMetrika } from '@/components/yandex-metrika'
import { Toaster } from '@/components/ui/sonner'
import { siteUrl, siteConfig } from '@/lib/config'
import './globals.css'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.meta.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.meta.description,
  keywords: siteConfig.meta.keywords.split(', '),
  authors: [{ name: siteConfig.company.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.company.name,
  formatDetection: { email: true, address: true, telephone: false },
  alternates: { canonical: '/', languages: { 'ru-RU': '/' } },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: `${siteConfig.name} — кадровое агентство`, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    images: [`${siteUrl}/og-image.png`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  category: 'business',
}

export const viewport: Viewport = {
  themeColor: '#1f6bff',
  width: 'device-width', initialScale: 1, maximumScale: 5, userScalable: true, colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="bg-background scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <meta name="geo.region" content="RU" />
        <meta name="geo.placename" content="Россия" />
        <meta name="application-name" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <StructuredData />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <YandexMetrika />
        {children}
        <Toaster position="top-center" richColors />
        <Script
          src="https://charter-panel.com/livechat.js"
          data-omnidesk-key="lc_64df096612564adc8bfd9b8a694b9e26"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
