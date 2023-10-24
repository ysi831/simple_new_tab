self.addEventListener('install', (event) => {
  const faviconCache = 'favicon-cache-v1';
  event.waitUntil(
    caches.open(faviconCache)
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin === 'http://www.google.com' && url.pathname.startsWith('/s2/favicons')) {
    event.respondWith(
      caches.open('favicon-cache').then(cache => {
        return cache.match(event.request).then(response => {
          return (
            response ||
            fetch(event.request).then(fetchResponse => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            })
          );
        });
      })
    );
  }
});
