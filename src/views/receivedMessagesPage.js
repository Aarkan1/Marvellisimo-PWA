import { client, collSend } from '../services/stitch.js'
import { getMarvels } from '../services/marvelProvider.js'
import searchList from '../components/searchList.js'

export default {
  components: {
    searchList
  },
  template: `
    <div id="recieved-messages-page" class="container">

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
    <div v-else class="hero-list">  

    <searchList 
      :items="messages"
      :keyField="'_id'" 
      v-slot="{ item }">
      <div 
        @click="goToDetails(item.itemId, item.type == 'character')" 
        class="list-item card small waves-effect waves-light recieved-message"
      >
        <div class="card-image">
          <img 
            v-if="item.thumbnail" 
            :src="item.thumbnail.path.replace('http://', 'https://') + '.' + item.thumbnail.extension"
            :key="item._id"
          />
        </div>
        <div class="card-content">
          <p>{{ item.name }}</p> 
          <p>Sender: {{ item.senderName }}</p>
          <p>Sent: {{ new Date(item.date / 1).toLocaleString() }}</p>
        </div>
      </div>
    </searchList>
  </div>
    </div>
    `,
    data() {
      return {
        messages: [],
        loadedLists: false
      }
    },
  methods: {
    goToDetails(id, char) {
      this.$router.push({
        path: '/details/' + id,
        query: {
          char: char
        }
      })
    }
  },
  async created() {
    this.$store.commit("setLogo", "Received Messages")
    this.timeout = setTimeout(() => {
      M.toast({
        html: '<div class="toast-text">Loading timeout</div>', 
        classes: 'toast', 
        displayLength: 2000
      })

      this.$router.push("/")
    }, this.$store.state.timeoutDuration);

    let fromIDB = await IDB.read('received-messages', client.auth.user.id)
    if(fromIDB) {
      this.messages = fromIDB.data
    } else { 
      this.messages = await collSend.find({ receiverId: client.auth.user.id }).toArray()
      
      let idbData = {
        id: client.auth.user.id,
        data: this.messages
      }
      await IDB.write('received-messages', idbData)
    }

    let promisedMessages = []
    await Promise.all(this.messages.map(async m => {
      let marvel = await getMarvels(m.type == 'character' ? 'characters' : 'series', '', m.itemId)
      m.thumbnail = marvel[0].thumbnail
      m.name = (marvel[0].name || marvel[0].title)
      promisedMessages.push(m)
    }))

    this.messages = promisedMessages
    
    clearTimeout(this.timeout)
    this.loadedLists = true
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  }
}