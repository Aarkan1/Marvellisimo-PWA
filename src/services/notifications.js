import { urlBase64ToUint8Array } from './utilities.js'
import { client } from './stitch.js'

export function subToNotifications() {
  if('Notification' in window) {
    Notification.requestPermission(result => {
      if(result !== 'granted') {
        console.log('No notifications permitted!')
      } else {
        configPushSub()
      }
    })
  }
}

async function swNotification() {
  if('serviceWorker' in navigator) {
    const sw = await navigator.serviceWorker.ready
    const options = {
      body: 'Test text in notification',
      icon: '/src/assets/icons/icon-96x96.png',
      badge: '/src/assets/icons/icon-96x96.png',
      tag: 'new-message-notify',
      data: {
        url: '/'
      },
      renotify: false,

    }

    sw.showNotification('Notification from service worker', options)
  }
}

async function configPushSub() {
  if(!('serviceWorker' in navigator)) return
  const sw = await navigator.serviceWorker.ready
  const subs = await sw.pushManager.getSubscription()

  if(subs == null) {
    // create sub
    if(!client.auth.isLoggedIn) {
      return 
    }
    
    let publicKey = 'BAvY4M_56t_c_9SoNEIkxjjEcc_V55gO2Cm7GPZNHKwTZu2tHcXFiDScshESK29z_tT97I2MLOgNYQIhmyC-SDA'
    publicKey = urlBase64ToUint8Array(publicKey)
    let newSub = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey
    })

    let sub = {
      newSub,
      userId: client.auth.user.id
    }

    let res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sub)
    })
    // res.ok && swNotification()

  } else {
    // have sub
    // swNotification()
  }
}