import { getMarvels } from '../services/marvelProvider.js'

export default {
  template: `
    <div id="details-page">
      <div class="marvel-image">  
        <img v-if="item.thumbnail" :src="item.thumbnail.path.replace('http://', 'https://') + '.' + item.thumbnail.extension" />
        <button @click="sendMarvel" class="send-marvel-btn btn-floating blue darken-3 btn-large waves-effect waves-light"><i class="material-icons">send</i></button>
      </div>
      <div>
        <h3 class="container">{{ item.name || item.title }}</h3>
        <p class="container">{{ item.description }}</p>
      </div>
    </div>
  `,
  data() {
    return {
      item: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    sendMarvel() {
      let data = {
        senderId: this.$store.state.user.uid, 
        itemId: '' + this.item.id,
        type: this.$route.query.char ? "character" : "serie",
        senderName: this.$store.state.user.username,
        date: '' + Date.now(),
        url: `/details/${this.item.id}${this.$route.query.char ? '?char=true' : ''}`
      }

      this.$router.push({
        path: '/friends',
        query: {
          toSend: true,
          data
        }
      })
    }
  },
  async created() {
    let list = this.$store.state[this.$route.query.char ? 'characterList' : 'serieList']
    let storedData = list.filter(item => item.id == this.$route.params.id)[0]
    if(storedData) {
      this.item = storedData
      return
    } 

    this.timeout = setTimeout(() => {
      M.toast({
        html: '<div class="toast-text">Loading timeout</div>', 
        classes: 'toast', 
        displayLength: 2000
      })

      this.$router.push("/")
    }, this.$store.state.timeoutDuration);
    
    this.result = await getMarvels(this.$route.query.char ? 'characters' : 'series', '', this.$route.params.id)
    this.item = this.result[0]

    clearTimeout(this.timeout)
    this.$store.commit("setLogo", (this.item.name || this.item.title))
  }
}