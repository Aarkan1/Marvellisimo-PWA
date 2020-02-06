import { getMarvels } from '../services/marvelProvider.js'

export default {
  template: `
    <div id="details-page">
      <div>
        <img v-if="item.thumbnail" :src="item.thumbnail.path + '.' + item.thumbnail.extension" />
      </div>
      <h3 class="container">{{ item.name || item.title }}</h3>
      <p class="container">{{ item.description }}</p>
      <button @click="sendMarvel" class="send-marvel-btn btn-floating blue darken-3 btn-large waves-effect waves-light"><i class="material-icons">send</i></button>
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
        date: '' + Date.now()
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
        html: '<div class="toast-text">Timeout loading</div>', 
        classes: 'toast', 
        displayLength: 2000
      })

      this.$router.push("/")
    }, 1000 * 5);
    
    this.result = await getMarvels(this.$route.query.char ? 'characters' : 'series', '', this.$route.params.id)
    this.item = this.result[0]
    
    clearTimeout(this.timeout)
    this.$store.commit("setLogo", (this.item.name || this.item.title))
  }
}