import { collUsers } from '../services/stitch.js'
import { uuid } from '../services/utilities.js'

export default {
  template: `
    <div id="friends-page" class="container">
    <div class="switch">
      <label>
        Offline
        <input v-model="onlineFriends" type="checkbox">
        <span class="lever"></span>
        Online
      </label>
    </div>
      <h3>{{ onlineFriends ? 'Online' : 'Offline' }}</h3>

      <div v-if="!loadedLists" class="spinner">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-yellow-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
      <ul v-else>
        <li v-for="friend in filteredFriends" 
        @click="sendMarvel(friend.uid)"
        :key="friend.uid"
        class="friend-username"
        >{{ friend.username }}</li>
      </ul>
    </div>
  `,
  data() {
    return {
      onlineFriends: true,
      friends: [],
      toSend: false,
      sendData: null,
      loadedLists: false
    }
  },
  methods: {
    async sendMarvel(toUserId) {
      if(!this.sendData) return
      this.sendData.receiverId = toUserId
      
      let data = {
        id: uuid(),
        message: this.sendData,
        notify: {
          title: 'New marvel from ' + this.$store.state.user.username,
          content: 'Check out this new marvel!',
          url: this.sendData.url
        }
      }

      if('serviceWorker' in navigator && 'SyncManager' in window) {
        await IDB.write('sync-messages', data)
        
        const sw = await navigator.serviceWorker.ready
        await sw.sync.register('sync-send-marvel')
        
      } else {
        console.log('Cannot sync messages');
        // No service worker or sync manager
        let res = await fetch('/api/send-message', {
          method: 'POST', 
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data)
        })

      }
      
      M.toast({
        html: '<div class="toast-text">Sent Marvel</div>', 
        classes: 'toast', 
        displayLength: 2000
      })

      this.$router.push("/")
    }
  },
  computed: {
    filteredFriends() {
      return this.friends.filter(friend => friend.isOnline == this.onlineFriends && friend.uid != this.$store.state.user.uid)
    }
  },
  async created() {
    this.$store.commit("setLogo", "Friends")
    this.friends = await collUsers.find().asArray()

    this.loadedLists = true

    this.toSend = this.$route.query.toSend
    this.sendData = this.$route.query.data
  }
}