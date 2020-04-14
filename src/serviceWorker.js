importScripts('/libs/idb.js')
importScripts('/services/IndexedDB-utils.js')

const VERSION = 7
const STATIC_CACHE = 'static-cache-v' + VERSION
const DYNAMIC_CACHE = 'dynamic-cache-v' + VERSION

const preCache = [
  '/',
  '/index.html',
  '/favorites',
  '/received-messages',
  '/friends',
  '/search',
  '/details',
  '/main.js',
  '/dist/main.js',
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

self.addEventListener("install", async (e) => {
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
  e.waitUntil(notifyRoute(e))
})

self.addEventListener('push', async e => {
  let data = {
    title: 'New something',
    content: 'What happened?',
    url: '/'
  }
  
  e.data && (data = JSON.parse(e.data.text()))

  // TODO: doesn't work, notifies everyone!!
  // only notify the receiver of the message
  let activeUserId = await IDB.read('user-data', 'active-user')
  console.log('idb user:', activeUserId.id);
  if(data.userId !== activeUserId.id) return

  const options = {
    body: data.content,
    icon: '/assets/icons/icon-96x96.png',
    badge: '/assets/badge-52x52.png',
    data: {
      url: data.url
    },
    tag: 'new-message',
    renotify: false
  }

  self.registration.showNotification(data.title, options)
})

const syncMessages = async () => {
  let data = await IDB.readAll('sync-messages')
  for(let dt of data) {
    let res = await fetch('/api/send-message', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dt)
    })

    res.ok && await IDB.delete('sync-messages', dt.id)
  }
}

self.addEventListener('sync', e => {
  if(e.tag === 'sync-send-marvel') {
    e.waitUntil(syncMessages())
  }
})
