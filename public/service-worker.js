const CACHE = 'tarefas-v1';
const ARQUIVOS = ['/', '/index.html', '/style.css', '/app.js', '/manifest.json',
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

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // API: rede primeiro (dados atuais); arquivos: cache primeiro
  if (url.pathname.startsWith('/api/')) {
    e.respondWith(fetch(req).catch(() => new Response(
      JSON.stringify({ erro: 'Sem conexão.' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
