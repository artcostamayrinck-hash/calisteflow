/**
 * CalisteFlow Service Worker
 * Versão do Cache: v1.0.0
 * 
 * Estratégia de Cache:
 * - Navegação / HTML: Network-First com fallback para cache offline
 * - Assets imutáveis com hash (/assets/*): Cache-First
 * - Manifest, Favicons e ícones: Stale-While-Revalidate
 * - Não aplicar skipWaiting automaticamente: aguarda confirmação do usuário via postMessage
 */

const CACHE_VERSION = 'calisteflow-v1.1.0';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './apple-touch-icon.png',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './maskable-icon-512x512.png',
  './assets/img/logo.png',
  './assets/img/logo.webp',
  './assets/img/logo-512x512.png',
  './assets/img/logo-512x512.webp',
  './robots.txt',
  './sitemap.xml',
];

// Instalação: realiza pré-cache dos recursos críticos mínimos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker] Falha no pré-cache parcial:', err);
      });
    })
  );
  // IMPORTANTE: NÃO chamamos self.skipWaiting() aqui para não derrubar treinos ativos
});

// Ativação: assume controle e limpa caches de versões anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION && key.startsWith('calisteflow-')) {
            console.log('[Service Worker] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Mensageria: recebe instrução segura de skipWaiting enviada pelo frontend
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Comando SKIP_WAITING recebido e confirmado pelo usuário.');
    self.skipWaiting();
  }
});

// Estratégia de Interceptação de Rede
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Aceitar apenas requisições GET
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Ignorar extensões de navegador ou esquemas não-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Requisição de Navegação (HTML principal / index.html): NETWORK-FIRST
  // Garante que o usuário sempre receba a versão mais recente quando online
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback offline: entrega index.html do cache
          return caches.match('/index.html').then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // 2. Assets estáticos versionados com hash Vite (/assets/*): CACHE-FIRST
  // Como contêm hash no nome do arquivo, são imutáveis e podem ser servidos do cache
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Demais recursos estáticos (manifest, ícones, fontes): STALE-WHILE-REVALIDATE
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Falha de rede tolerada se já houver cópia em cache
          return null;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

