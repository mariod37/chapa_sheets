// Service Worker para soporte offline
const CACHE_NAME = 'chapa-sheets-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/predicacion.html',
  '/limpieza.html',
  '/asignaciones.html',
  '/Audio-video.html',
  '/vida-ministerio.html',
  '/assets/css/styles.css',
  '/assets/js/offline-support.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  // Para peticiones a Google Sheets, intentar red primero, cache después
  if (event.request.url.includes('docs.google.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clonar la respuesta
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Si falla la red, devolver desde cache
          return caches.match(event.request);
        })
    );
  } else {
    // Para otros recursos, cache primero
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
