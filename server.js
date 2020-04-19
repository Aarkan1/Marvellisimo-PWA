const express = require("express");
const port = 3020
const app = express();
const path = require('path');
const fs = require('fs');
const gzippo = require('gzippo');
const webpush = require('web-push')
const mongoose = require("mongoose")
const atlasKey = 'mongodb+srv://flexy:3rtkLpYHaBKsDN8U@cluster0-myi0o.mongodb.net/marvellisimo?retryWrites=true&w=majority'
mongoose.connect(atlasKey, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;

app.use(express.json())

// update path to main js file
const indexPath = __dirname + '/src/index.html'
let indexContent = fs.readFileSync(indexPath, 'utf8')
fs.writeFileSync(indexPath, indexContent.replace(/src="(main-\w*\.js)"/, 'src="/dist/$1"'))

// update service worker version
const swPath = __dirname + '/src/serviceWorker.js'
let swContent = fs.readFileSync(swPath, 'utf8')
let swLines = swContent.split('\n')
let swVersion = + swLines[0].split('=')[1]
swVersion++
swLines[0] = 'let VERSION=' + swVersion
fs.writeFileSync(swPath, swLines.join('\n'))

const Sub = mongoose.model('Sub', {
  uid: String,
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  },
  userIds: [String]
})

const Message = mongoose.model('Message', {
  id: String,
  senderId: String, 
  receiverId: String, 
  itemId: String,
  type: String,
  senderName: String,
  date: String
}, 'send')

db.on("error", () => console.log("Couldn't connect to DB"));

db.once("open", () => {
  console.log("Connected to DB");
  app.listen(port, () => console.log("listening on port", port))
});


const publicKey = 'BAvY4M_56t_c_9SoNEIkxjjEcc_V55gO2Cm7GPZNHKwTZu2tHcXFiDScshESK29z_tT97I2MLOgNYQIhmyC-SDA'
const privateKey = '2mTSkEePckd__m6Wq7u8m7VEmgAArWH71FNFj90kKv8'

app.post('/api/subscriptions', (req, res) => {
  const sub = new Sub(req.body.newSub)
  sub.uid = sub._id.toString()
  sub.userIds = [req.body.userId]

  sub.save() 
  res.json({ subId: sub._id })
})

const sendNotification = async (id, body) => {
  webpush.setVapidDetails('mailto:somemail@gmail.com', publicKey, privateKey)
  let filter = id ? { userIds: id } : {}
  let subs = await Sub.find(filter).catch(console.error)
  subs.filter(s => s.endpoint).forEach(async sub => {
    let config = {
      endpoint: sub.endpoint,
      keys: sub.keys
    }
    let payload = {
      title: 'Notify from server',
      content: 'Hey dudes',
      url: '/recieved-messages'
    }
    body && (payload = body)
    payload.userId = id

    webpush.sendNotification(config, JSON.stringify(payload)).catch(async e => {
      // Removes subscription from DB if client unsubscribed
      if(e.body == 'push subscription has unsubscribed or expired.\n') {
        console.error(e.body)
        await Sub.deleteOne({endpoint: e.endpoint})
      }
    })
  })
}

app.post('/api/send-message', async (req, res) => {
  const message = new Message(req.body.message)
  await message.save()
  sendNotification(req.body.message.receiverId, req.body.notify)
  res.json({ message: 'ok' })
})

app.post('/api/send-notifications', (req, res) => {
  sendNotification()
  res.json({ message: 'ok' })
})

app.post('/api/send-notifications/:id', (req, res) => {
  sendNotification(req.params.id, req.body)
  res.json({ message: 'ok' })
})

// gzip all js files
app.use(gzippo.staticGzip(__dirname + '/'));
app.use(gzippo.staticGzip(__dirname + '/src'));
app.use(gzippo.staticGzip(__dirname + '/src/dist'));

// SPA, frontend routing
app.get('*', function(req, res) {
  res.sendFile(__dirname + "/src/index.html");
});
