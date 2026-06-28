const CACHE_NAME = 'uzbro-cache-v11';
const OFFLINE_URL = '/offline.html';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/cookie-policy.html',
  '/privacy-policy.html',
  '/oferta.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon.ico',
  '/icons/icon-512x512.png',
  '/icons/favicon-96x96.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192x192.png',
  '/icons/max.svg',

  '/images/bg-hero/bg-hero-360px.avif',
  '/images/bg-hero/bg-hero-360px.jpg',
  '/images/bg-hero/bg-hero-360px.webp',
  '/images/bg-hero/bg-hero-640px.avif',
  '/images/bg-hero/bg-hero-640px.jpg',
  '/images/bg-hero/bg-hero-640px.webp',
  '/images/bg-hero/bg-hero-960px.avif',
  '/images/bg-hero/bg-hero-960px.jpg',
  '/images/bg-hero/bg-hero-960px.webp',
  
  '/images/bg-works/bg-works-360px.avif',
  '/images/bg-works/bg-works-360px.jpg',
  '/images/bg-works/bg-works-360px.webp',
  '/images/bg-works/bg-works-640px.avif',
  '/images/bg-works/bg-works-640px.jpg',
  '/images/bg-works/bg-works-640px.webp',
  '/images/bg-works/bg-works-960px.avif',
  '/images/bg-works/bg-works-960px.jpg',
  '/images/bg-works/bg-works-960px.webp',
  '/images/bg-works/bg-works-1280px.avif',
  '/images/bg-works/bg-works-1280px.jpg',
  '/images/bg-works/bg-works-1280px.webp',
  
  '/images/masters/dmitriy/dmitriy-360px.avif',
  '/images/masters/dmitriy/dmitriy-360px.jpg',
  '/images/masters/dmitriy/dmitriy-360px.webp',
  '/images/masters/dmitriy/dmitriy.png',

  '/images/our_works/1/1-360px.avif',
  '/images/our_works/1/1-360px.jpg',
  '/images/our_works/1/1-360px.webp',
  '/images/our_works/1/1.jpg',
  '/images/our_works/2/2-360px.avif',
  '/images/our_works/2/2-360px.jpg',
  '/images/our_works/2/2-360px.webp',
  '/images/our_works/2/2.jpg',
  '/images/our_works/3/3-360px.avif',
  '/images/our_works/3/3-360px.jpg',
  '/images/our_works/3/3-360px.webp',
  '/images/our_works/3/3.jpg',
  '/images/our_works/4/4-360px.avif',
  '/images/our_works/4/4-360px.jpg',
  '/images/our_works/4/4-360px.webp',
  '/images/our_works/4/4.jpg',
  
  '/images/qr-code/qr-code-360px.avif',
  '/images/qr-code/qr-code-360px.jpg',
  '/images/qr-code/qr-code-360px.webp',
  '/images/qr-code/qr-code.jpg',
  
  '/js/particles.min.js',
  
  '/fonts/Inter-Regular.woff2',
  '/fonts/Inter-Regular.woff',
  '/fonts/Inter-Medium.woff2',
  '/fonts/Inter-Medium.woff',
  '/fonts/Inter-SemiBold.woff2',
  '/fonts/Inter-SemiBold.woff',
  '/fonts/Inter-Bold.woff2',
  '/fonts/Inter-Bold.woff',
  '/fonts/Inter-ExtraBold.woff2',
  '/fonts/Inter-ExtraBold.woff',
  '/fonts/Inter-Black.woff2',
  '/fonts/Inter-Black.woff',

  '/fonts/webfonts/fa-solid-900.woff2',
  '/fonts/webfonts/fa-regular-400.woff2',
  '/fonts/webfonts/fa-brands-400.woff2'
];

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        try {
          await cache.put(request, networkResponse.clone());
          console.log('[SW] ♻️ Кэш обновлён:', request.url);
        } catch (e) {
          // ignore
        }
      }
      return networkResponse;
    })
    .catch(() => null);
  
  return cachedResponse || fetchPromise;
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || caches.match(OFFLINE_URL);
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('', { status: 503 });
  }
}

self.addEventListener('install', (event) => {
  console.log('[SW] Установка, кэшируем файлы...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэшируем', FILES_TO_CACHE.length, 'файлов');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] ✅ Кэширование завершено');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] ❌ Ошибка кэширования:', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (url.hostname.includes('yclients.com')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (['2gis.ru', 'makemap', 'maps.googleapis'].some(host => url.hostname.includes(host))) {
    event.respondWith(
      new Response('', { 
        status: 200, 
        headers: { 'Content-Type': 'text/html' }
      })
    );
    return;
  }

  if (url.pathname.includes('/api/') || (url.search.includes('callback') && url.search.includes('?'))) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response('API недоступно в офлайн-режиме', { 
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
    );
    return;
  }

  const ext = url.pathname.split('.').pop().toLowerCase();
  
  if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'ico'].includes(ext)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] 🗑️ Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(
    clients.claim().then(() => {
      clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            message: 'Доступна новая версия сайта'
          });
        });
      });
    })
  );
  console.log('[SW] ✅ Service Worker активирован');
});

self.addEventListener('message', (event) => {
  if (event.data === 'get-status') {
    event.ports[0].postMessage({
      online: navigator.onLine,
      cacheName: CACHE_NAME,
      filesCount: FILES_TO_CACHE.length
    });
  }
});