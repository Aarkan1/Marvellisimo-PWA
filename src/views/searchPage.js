export default {
  template: `
    <div id="search-page">
      <div class="row">
        <div class="input-field search col s10">
          <i class="material-icons prefix">search</i>
          <input id="icon_prefix" autocomplete="off" @keyup.enter="doSearch" v-model="searchTerm" type="text">
          <label for="icon_prefix">Search</label>
        </div>
        <button class="btn-floating btn-large btn-flat" @click="doSearch"><i class="material-icons black-text">image_search</i></button>
      </div>

      <ul class="seach-history" @click="useSearchHistory">
        <li v-for="item of searchHistory" :key="item.term">{{ item.term }}</li>
      </ul>
    </div>
  `,
  data() {
    return {
      searchHistory: [],
      searchTerm: ''
    }
  },
  methods: {
    doSearch(){
      if(!this.searchTerm.trim()) return

      const inList = this.searchHistory.filter(item => item.term == this.searchTerm).length > 0

      if(!inList) {
        this.searchHistory.push({ 
          term: this.searchTerm,
          ts: Date.now()
        })
      } else {
        this.searchHistory.forEach(item => item.term == this.searchTerm && (item.ts = Date.now()))
      }
      localStorage.setItem("search-history", JSON.stringify(this.searchHistory))
      this.$router.push('/search/' + this.searchTerm)
    },
    useSearchHistory(e) {
      this.searchTerm = e.target.innerText
      this.doSearch()
    }
  },
  created() {
    this.$store.commit('setLogo', 'Search')
    this.searchHistory = JSON.parse(localStorage.getItem("search-history")) || []
    this.searchHistory.sort((a, b) => a.ts > b.ts ? -1 : 1)

    M.updateTextFields()
  }
}