import { getMarvels } from '../services/marvelProvider.js'
import searchListItem from '../components/searchListItem.js'

export default {
  components: {
    searchListItem
  },
  template: `
    <div id="search-list-page" class="container">
    <div class="switch">
      <label>
        Series
        <input v-model="displayChar" type="checkbox">
        <span class="lever"></span>
        Characters
      </label>
    </div>
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
        <searchListItem class="list-item" v-for="item in activeList" :key="item.id" :data="item" :char="displayChar" />
      </div>
    </div>
  `,
  data() {
    return {
      displayChar: true,
      loadedLists: false
    }
  },
  computed: {
    activeList() {
      return this.displayChar ? this.$store.state.characterList : this.$store.state.serieList
    }
  },
  async created() {
    this.$store.commit('setLogo', this.$route.params.term)
    this.timeout = setTimeout(() => {
      M.toast({
        html: '<div class="toast-text">Loading timeout</div>', 
        classes: 'toast', 
        displayLength: 2000
      })

      this.$router.push("/")
    }, this.$store.state.timeoutDuration);
    this.$store.commit('setCharList', await getMarvels('characters', this.$route.params.term))
    this.$store.commit('setSerieList', await getMarvels('series', this.$route.params.term))

    clearTimeout(this.timeout)
    this.loadedLists = true
  },
  beforeDestroy() {
    clearTimeout(this.timeout)
  }
}
