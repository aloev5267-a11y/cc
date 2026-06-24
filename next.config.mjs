/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Оптимизация картинок
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Нативные модули — не бандлить
  serverExternalPackages: ['pg'],

  // Разбивка тяжёлых UI-компонентов в отдельные чанки
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://charter-panel.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://charter-panel.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" },
        ],
      },
    ]
  },
}

export default nextConfig
