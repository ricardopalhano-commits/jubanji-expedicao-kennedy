const CACHE = 'jubanji-v5';
const ARQUIVOS = ['/', '/index.html', '/style.css', '/app.js', '/perguntas.js', '/audio.js', '/manifest.json',
  '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) =>
    Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Rede primeiro (sempre a versão nova); offline usa o cache (inclui as imagens já vistas)
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).pathname.startsWith('/api/')) return;
  e.respondWith(fetch(req).then((r) => {
    const copia = r.clone();
    caches.open(CACHE).then((c) => c.put(req, copia));
    return r;
  }).catch(() => caches.match(req)));
});
