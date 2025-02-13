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
        source: '/sw.js',
        headers: [
          {
            source: "/(.*)",
            headers: [
              {
                key: "Content-Security-Policy",
                value: "default-src 'self'; connect-src 'self' https://mc.yandex.ru; script-src 'self' 'unsafe-inline' https://mc.yandex.ru; img-src 'self' https://mc.yandex.ru;",
              },
            ],
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' ",
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
