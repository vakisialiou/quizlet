import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com'
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/((?!api).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://mc.yandex.com https://yastatic.net https://www.googletagmanager.com; img-src 'self' https://mc.yandex.ru https://mc.yandex.com https://yastatic.net https://yandex.ru/cycounter https://yandex.com/cycounter;"
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
