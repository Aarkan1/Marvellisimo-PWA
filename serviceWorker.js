importScripts('/src/libs/idb.js')
importScripts('/src/services/IndexedDB-utils.js')

const STATIC_CACHE = 'static-cache-v3'
const DYNAMIC_CACHE = 'dynamic-cache-v4'

const preCache = [
  '/',
  '/index.html',
  '/favorites',
  '/recieved-messages',
  '/friends',
  '/search',
  '/details',
  '/src/main.js',
  // '/src/components/navbar.js',
  // '/src/components/searchListItem.js',
  // '/src/assets/marvel_bg.jpg',
  // '/src/css',
  // '/src/libs',
  // '/src/views',
]

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
  let response = await caches.match(e.request);
  
  if (response) {
    return response;
  } else {
    let res = await fetch(e.request).catch(async e => {
      // offline fallback
      let staticCache = await caches.open(STATIC_CACHE);
      return staticCache.match("/index.html");
    });

    let cache = await caches.open(DYNAMIC_CACHE);
    let putResult = cache.put(e.request, res.clone());

    if (e.request.url.endsWith('/auth/session') && e.request.method == 'DELETE') {
      await putResult;
      const keyList = await caches.keys();
      await Promise.all(keyList.filter(key => key.includes('mongodb')).map(key => { return caches.delete(key); }));
    } 

    return res;
  }
};

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(preCache);
      })
  )
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(activateEvent());
  return self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || e.request.url.includes('marvel/i/mg')) return
  return e.respondWith(cacheFirst(e))
});

const notifyRoute = async e => {
  let { url } = e.notification.data
  let clis = await clients.matchAll()
  let client = clis.find(c => c.visibilityState === 'visible')
  if(client !== undefined) {
    client.navigate(url)
    client.focus()
  } else {
    clients.openWindow(url)
  }
  e.notification.close()
}

self.addEventListener('notificationclick', e => {
  console.log(e.notification)

  e.waitUntil(notifyRoute(e))
})

self.addEventListener('push', e => {
  let data = {
    title: 'New something',
    content: 'What happened?',
    url: '/'
  }
  
  e.data && (data = JSON.parse(e.data.text()))
  
  const options = {
    body: data.content,
    icon: '/src/assets/icons/icon-96x96.png',
    badge: '/src/assets/icons/icon-96x96.png',
    data: {
      url: data.url
    },
    tag: 'new-message',
    renotify: false
  }

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})