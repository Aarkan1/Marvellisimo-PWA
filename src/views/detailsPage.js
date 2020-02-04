import { getMarvels } from '../services/marvelProvider.js'

export default {
  template: `
    <div id="details-page">
      <div>
        <img v-if="item.thumbnail" :src="item.thumbnail.path + '.' + item.thumbnail.extension" />
      </div>
      <h3 class="container">{{ item.name || item.title }}</h3>
      <p class="container">{{ item.description }}</p>
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
  async created() {
    let list = this.$store.state[this.$route.query.char ? 'characterList' : 'serieList']
    let storedData = list.filter(item => item.id == this.$route.params.id)[0]
    if(storedData) {
      this.item = storedData
      return
    } 

    this.result = await getMarvels(this.$route.query.char ? 'characters' : 'series', '', this.$route.params.id)
    this.item = this.result[0]
  }
}