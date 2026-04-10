importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');

workbox.core.setCacheNameDetails({ prefix: 'nimbus' });
workbox.core.clientsClaim();
workbox.core.skipWaiting();

workbox.precaching.precacheAndRoute([
  { url: '/', revision: null },
  { url: '/index.html', revision: null },
  { url: '/manifest.webmanifest', revision: null },
]);

// Cache product/category API calls
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/products') || url.pathname.startsWith('/api/categories'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'api-products',
    plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 3600 })]
  })
);

// Cache images
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 604800 })]
  })
);

// Orders — always try network first
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/orders'),
  new workbox.strategies.NetworkFirst({ cacheName: 'api-orders', networkTimeoutSeconds: 3 })
);

// Background Sync for checkout
const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('checkoutQueue', { maxRetentionTime: 1440 });
workbox.routing.registerRoute(
  ({ url, request }) => url.pathname === '/api/orders' && request.method === 'POST',
  new workbox.strategies.NetworkOnly({ plugins: [bgSyncPlugin] }),
  'POST'
);