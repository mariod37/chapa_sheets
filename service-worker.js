// Service Worker para soporte offline
const CACHE_NAME = 'chapa-sheets-v2';

// Obtener la ruta base del service worker (funciona en local y GitHub Pages)
const BASE_PATH = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'predicacion.html',
  BASE_PATH + 'limpieza.html',
  BASE_PATH + 'asignaciones.html',
  BASE_PATH + 'Audio-video.html',
  BASE_PATH + 'vida-ministerio.html',
  BASE_PATH + 'vida-ministerio1.html',
  BASE_PATH + 'vida-ministerio2.html',
  BASE_PATH + 'vida-ministerio3.html',
  BASE_PATH + 'assets/css/styles.css',
  BASE_PATH + 'assets/js/offline-support.js',
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
