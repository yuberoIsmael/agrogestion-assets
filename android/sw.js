const cacheNombre = 'agrogestion-android-v1';
const recursos = ['./', './index.html', './app.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', evento => {
  evento.waitUntil(caches.open(cacheNombre).then(cache => cache.addAll(recursos)));
});

self.addEventListener('activate', evento => {
  evento.waitUntil(caches.keys().then(nombres => Promise.all(nombres
    .filter(nombre => nombre.startsWith('agrogestion-android-') && nombre !== cacheNombre)
    .map(nombre => caches.delete(nombre)))));
});

self.addEventListener('fetch', evento => {
  const url = new URL(evento.request.url);
  if (evento.request.method !== 'GET' || url.origin !== self.location.origin ||
    !recursos.some(ruta => new URL(ruta, self.registration.scope).href === url.href)) return;
  evento.respondWith(fetch(evento.request).catch(() => caches.match(evento.request)));
});
