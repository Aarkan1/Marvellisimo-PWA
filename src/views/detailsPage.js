import { getMarvels } from '../services/marvelProvider.js'

export default {
  template: `
    <div id="details-page">
      <div class="marvel-image">  
        <img v-if="item.thumbnail" :src="item.thumbnail.path.replace('http://', 'https://') + '.' + item.thumbnail.extension" />
        <button @click="sendMarvel" class="send-marvel-btn btn-floating blue darken-3 btn-large waves-effect waves-light"><i class="material-icons">send</i></button>
        <button @click.stop="updateFavorite" class="btn-floating blue lighten-3 btn-large detail-favorite waves-effect waves-light"><i class="material-icons">{{ isFavorited ? 'favorite' : 'favorite_border'}}</i></button>
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
  computed: {
    isFavorited() {
      if(!this.$store.state.user) return

      let isChar = this.$route.query.char
      return this.$store.state.user[isChar ? 'favoriteCharacters' : 'favoriteSeries']
        .filter(charID => charID == this.item.id).length > 0
    }
  },
  methods: {
    updateFavorite() {
      let isChar = this.$route.query.char
      let list = this.$store.state.user[isChar ? 'favoriteCharacters' : 'favoriteSeries']
      if(this.isFavorited) {
        list.splice(list.indexOf(this.item.id), 1)
      } else {
        !list.includes(this.item.id) && list.push(this.item.id)
      }
      this.$store.dispatch('updateUser')
      this.$emit('updateFavorite', this.item.id)
    },
    sendMarvel() {
      let data = {
        senderId: this.$store.state.user.uid, 
        itemId: '' + this.item.id,
        type: this.$route.query.char ? "character" : "serie",
        senderName: this.$store.state.user.username,
        date: '' + Date.now(),
        url: `/details/${this.item.id}${this.$route.query.char ? '?char=true' : ''}`
      }

      this.$store.commit('setDataToSend', data)

      this.$router.push({
        path: '/friends',
        query: {
          toSend: true
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