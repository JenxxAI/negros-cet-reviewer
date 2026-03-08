// NegrosREV Service Worker — cache-first with network fallback
const CACHE_NAME = 'negrev-v2'
const PRECACHE_URLS = ['/', '/exam']

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  // Never intercept Supabase API or Next.js internal requests
  if (url.hostname.includes('supabase.co')) return
  if (url.pathname.startsWith('/_next/')) return
  if (url.pathname.startsWith('/api/')) return

  // Navigation: network first, cache as offline fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
          return res
        })
        .catch(() => caches.match('/'))
    )
    return
  }

  // Everything else: cache first, update in background
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone))
        }
        return res
      }).catch(() => null)
      return cached || networkFetch
    })
  )
})
