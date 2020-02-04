import { getMarvels } from '../services/marvelProvider.js'
import searchListItem from '../components/searchListItem.js'

export default {
  components: {
    searchListItem
  },
  template: `
    <div id="search-list-page">
    <div class="switch">
      <label>
        Series
        <input v-model="displayChar" type="checkbox">
        <span class="lever"></span>
        Characters
      </label>
    </div>
      <searchListItem v-for="item in activeList" :key="item.id" :data="item" :char="displayChar" />
    </div>
  `,
  data() {
    return {
      displayChar: true
    }
  },
  computed: {
    activeList() {
      return this.displayChar ? this.$store.state.characterList : this.$store.state.serieList
    }
  },
  async created() {
    console.log(this.$route.params.term);
    
    this.$store.commit('setLogo', this.$route.params.term)
    this.$store.commit('setCharacterList', await getMarvels('characters', this.$route.params.term))
    this.$store.commit('setSerieList', await getMarvels('series', this.$route.params.term))
  }
}