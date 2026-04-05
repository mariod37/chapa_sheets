// Service Worker para soporte offline
const CACHE_NAME = 'chapa-sheets-v3';

// Obtener la ruta base del service worker (funciona en local y GitHub Pages)
const BASE_PATH = self.location.pathname.substring(0, self.location.pathname.lastIndexOf('/') + 1);

const pagesToCache = [
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

// Instalación: cachear cada URL individualmente para que un fallo no cancele todo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const cachePromises = pagesToCache.map(url =>
        cache.add(url).catch(err => {
          console.warn('⚠️ No se pudo cachear:', url, err.message);
        })
      );
      return Promise.all(cachePromises);
    }).then(() => {
      console.log('✅ Service Worker instalado');
      return self.skipWaiting(); // Activar inmediatamente sin esperar
    })
  );
});

// Activación: borrar cachés viejos y tomar control inmediato
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim()) // Tomar control de todas las pestañas abiertas
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  // Para peticiones a Google Sheets: red primero, caché como fallback
  if (url.includes('docs.google.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Para navegación (HTML) y recursos locales: caché primero, red como fallback
  // Si no está en caché ni hay red, no hacer nada (el navegador mostrará su error)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // No está en caché, intentar red y guardar resultado
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      });
    })
  );
});
