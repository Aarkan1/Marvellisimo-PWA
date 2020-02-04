const activateEvent = async () => {
  let keyList = await caches.keys();
  return Promise.all(
    keyList.map(key => {
        console.log("[Service Worker] Removing old cache:", key);
        return caches.delete(key);
      })
  );
};

const cacheFirst = async e => {
  if (e.request.url.includes('/socket.io/?EIO')) {
    return await fetch(e.request).catch(() => { });
  }

  let response = await caches.match(e.request);
  if (response) {
    return response;
  } else {
    let res = await fetch(e.request).catch(async err => {
      // offline fallback
      // let staticCache = await caches.open(cacheTimestamp);
      // return staticCache.match("/offline.html");
    });

    let cache = await caches.open(cacheTimestamp);
    let putResult = cache.put(e.request.url, res.clone());

    console.log(e.request.method);

    if (e.request.url.endsWith('/auth/session') && e.request.method == 'DELETE') {
      await putResult;
      const keyList = await caches.keys();
      await Promise.all(keyList.map(key => { return caches.delete(key); }));
    } 

    return res;
  }
};

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(activateEvent());
  return self.clients.claim();
});

self.addEventListener("fetch", e => e.respondWith(cacheFirst(e)));
