import searchListItem from '../components/searchListItem.js'
import { getMarvels } from '../services/marvelProvider.js'
import { sleep } from '../services/utilities.js'
import searchList from '../components/searchList.js'

export default {
  components: {
    searchList,
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
    <div v-else> 
      <searchList
        :items="activeList"
        :keyField="'id'"
        v-slot="{ item }"
      >
        <searchListItem class="list-item" :data="item" :char="displayChar" @updateFavorite="updateFavorite"/>
      </searchList> 
    </div>
  </div>
  `,
  data() {
    return {
      displayChar: true, 
      favoriteCharacters: [], 
      favoriteSeries: [],
      loadedLists: false
    }
  },
  computed: {
    activeList() {
      return this.displayChar ? this.favoriteCharacters : this.favoriteSeries 
    }
  },
  methods: {
    updateFavorite(id) {
      let list = this[this.displayChar ? 'favoriteCharacters' : 'favoriteSeries']
      list.splice(list.indexOf(list.filter(item => item.id == id)[0]), 1)
    }
  },
  async created() {
    this.$store.commit("setLogo", "Favorites")
    while(!this.$store.state.user) await sleep(20)

    this.timeout = setTimeout(() => {
      M.toast({
        html: '<div class="toast-text">Loading timeout</div>', 
        classes: 'toast', 
        displayLength: 2000
      })

      this.$router.push("/")
    }, this.$store.state.timeoutDuration);

    await Promise.all(
      this.$store.state.user.favoriteCharacters
      .map(async charID => this.favoriteCharacters.push(
          await getMarvels('characters', '', charID)
        )
      ))
    await Promise.all(
      this.$store.state.user.favoriteSeries
      .map(async serieID => this.favoriteSeries.push(
          await getMarvels('series', '', serieID)
        )
      ))

    this.favoriteCharacters = this.favoriteCharacters.flat()
    this.favoriteSeries = this.favoriteSeries.flat()

    clearTimeout(this.timeout)
    this.loadedLists = true
  }
}
