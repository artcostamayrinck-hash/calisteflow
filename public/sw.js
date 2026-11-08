/**
 * CalisteFlow Service Worker
 * Versão do Cache: calisteflow-v4.0.0
 * Escopo: /calisteflow/
 *
 * Estratégia de Cache:
 * - HTML / Navegação: Network-First com fallback para cache offline (/calisteflow/index.html)
 * - Assets estáticos (/calisteflow/assets/*): Cache-First com fallback para rede
 * - Recursos estáticos raiz e ícones (manifest, ícones transparentes com ?v=3, favicons, og-image): Stale-While-Revalidate
 * - Não recarrega o app no meio de um treino ativo (skipWaiting só sob comando do usuário)
 */

const CACHE_NAME = 'calisteflow-v4.0.0';

// Lista de arquivos fundamentais para inicialização offline no escopo /calisteflow/
const PRECACHE_ASSETS = [
  '/calisteflow/',
  '/calisteflow/index.html',
  '/calisteflow/manifest.json',
  '/calisteflow/assets/img/favicon.ico?v=3',
  '/calisteflow/assets/img/favicon-32x32.png?v=3',
  '/calisteflow/assets/img/favicon-16x16.png?v=3',
  '/calisteflow/assets/img/apple-touch-icon.png?v=3',
  '/calisteflow/assets/img/icon-192.png?v=3',
  '/calisteflow/assets/img/logo-512.png?v=3',
  '/calisteflow/assets/img/logo-256.png?v=3',
  '/calisteflow/assets/img/logo.png',
  '/calisteflow/assets/img/og-image.png',
  '/calisteflow/favicon.ico?v=3',
  '/calisteflow/favicon-32x32.png?v=3',
  '/calisteflow/favicon-16x16.png?v=3',
  '/calisteflow/apple-touch-icon.png?v=3',
  '/calisteflow/icon-192.png?v=3',
  '/calisteflow/logo-512.png?v=3',
  '/calisteflow/logo.png',
  '/calisteflow/og-image.png',
  '/calisteflow/robots.txt',
  '/calisteflow/sitemap.xml',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const results = await Promise.allSettled(
        PRECACHE_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: 'no-cache' });
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn('[SW] Pré-cache falhou para:', url, err);
          }
        })
      );
      return results;
    })
  );
  // Não chamamos skipWaiting() imediatamente para preservar o estado de treinos em andamento
});

// Ativação e limpeza de versões antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith('calisteflow-')) {
            console.log('[SW] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições de rede
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar requisições que não sejam GET ou sejam para extensões do navegador
  if (req.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 1. Navegação (Documento HTML principal) -> Network-First com fallback para cache offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          // Offline fallback
          const cached = await caches.match(req);
          if (cached) return cached;

          const cachedHome = await caches.match('/calisteflow/index.html');
          if (cachedHome) return cachedHome;

          const cachedScope = await caches.match('/calisteflow/');
          if (cachedScope) return cachedScope;

          return caches.match('./index.html');
        })
    );
    return;
  }

  // 2. Assets compilados do Vite com hash (/assets/*) -> Cache-First
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // 3. Imagens, fontes e manifest -> Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => null);

      return cached || fetchPromise;
    })
  );
});

// Mensageria: permite que o usuário atualize o app com segurança
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Recebido SKIP_WAITING aprovado pelo usuário');
    self.skipWaiting();
  }
});
