import { urlBase64ToUint8Array } from './utilities.js'
import { client, collSubs } from './stitch.js'

export async function subToNotifications() {
  if('Notification' in window) {
    Notification.requestPermission(async result => {
      if(result !== 'granted') {
        console.log('No notifications permitted!')
      } else {
        await configPushSub()
      }
    })
  }
}

async function configPushSub() {
  if(!('serviceWorker' in navigator)) return
  const sw = await navigator.serviceWorker.ready
  const subs = await sw.pushManager.getSubscription()

  if(subs == null) {
    // create sub
  
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
      body: JSON.stringify(newSub)
    })
    res = await res.json()
    console.log('sub id:', res.subId);
    
    await IDB.write('user-data', {
      uid: 'sub-id',
      id: res.subId
    })

    let dbSub = await collSubs.findOne({ uid: idbSub.id })
    if(!dbSub.userIds.includes(client.auth.user.id)) dbSub.userIds.push(client.auth.user.id)
    await collSubs.findOneAndReplace({ uid: idbSub.id }, dbSub).catch(console.error)

  } else {
    // have sub
    // swNotification()
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
      renotify: false,
      data: {
        url: '/'
      }
    }
    sw.showNotification('Notification from service worker', options)
  }
}