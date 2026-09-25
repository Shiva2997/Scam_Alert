/* Scam Aware service worker — offline support for the static app.
 * Strategy:
 *  - On install, cache the app shell plus every asset referenced by index.html,
 *    so the checklist works offline after the very first visit.
 *  - Navigations: network first, falling back to the cached shell.
 *  - Other same-origin GETs: cache first, then network (and cache the result).
 * Bump VERSION on breaking changes to clear old caches.
 */
const VERSION = 'v0.1.0'
const CACHE = `scam-aware-${VERSION}`
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(SHELL)
      try {
        const html = await (await fetch('./index.html', { cache: 'no-store' })).text()
        const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((m) => m[1])
        await cache.addAll(assets)
      } catch {
        /* ignore — assets will be cached at runtime */
      }
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k.startsWith('scam-aware-') && k !== CACHE).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request)
          const cache = await caches.open(CACHE)
          cache.put('./index.html', fresh.clone())
          return fresh
        } catch {
          return (await caches.match('./index.html')) || Response.error()
        }
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request)
      if (cached) return cached
      const response = await fetch(request)
      if (response.ok) {
        const cache = await caches.open(CACHE)
        cache.put(request, response.clone())
      }
      return response
    })(),
  )
})
