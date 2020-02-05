import { collUsers, collSend } from '../services/stitch.js'

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
      this.sendData.receiverId = toUserId
      await collSend.insertOne(this.sendData).catch(console.error)

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
    this.friends = await collUsers.find().asArray()

    this.loadedLists = true

    this.toSend = this.$route.query.toSend
    this.sendData = this.$route.query.data
  }
}