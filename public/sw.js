const searchParams = new URL(self.location).searchParams
const enabled = searchParams.get('enabled')
const cacheName = searchParams.get('cacheName')

const CACHE_NAME = searchParams.get('cacheName') || 'qp-pwa-cache-v4'
const SUPPORTED_LOCALES = ['en', 'ru']
const ASSETS_TO_CACHE = [
  ...SUPPORTED_LOCALES.map((locale) => `/${locale}/offline`),
]

if (enabled === 'true') {
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE)
      })
    )
    self.skipWaiting()
  })

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache)
            }
          })
        )
      })
    )
    self.clients.claim()
  })

  self.addEventListener('fetch', (event) => {
    const { request } = event
    if (request.url.startsWith('chrome-extension://')) {
      return
    }

    const url = new URL(request.url)

    const isOfflinePageRequest = SUPPORTED_LOCALES.some((locale) =>
      url.pathname === `/${locale}/offline`
    )

    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }

        return fetch(request)
          .then((networkResponse) => {
            if (isOfflinePageRequest
              || request.url.includes('/_next/static/')
              || request.url.includes('/images')
              || request.url.includes('/icons')
            ) {
              const responseClone = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return networkResponse
          })
          .catch(() => {
            if (request.mode === 'navigate') {
              const locale = SUPPORTED_LOCALES.find((locale) =>
                url.pathname.startsWith(`/${locale}`)
              )
              if (locale) {
                return caches.match(`/${locale}/offline`)
              }
            }
          })
      })
    )
  })
}
