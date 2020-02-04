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
      <div v-if="activeList[0] && activeList[0].thumbnail">
        <searchListItem v-for="item in activeList" :key="item.id" :data="item" :char="displayChar" />
      </div>
    </div>
  `,
  data() {
    return {
      displayChar: true
    }
  },
  computed: {
    activeList() {
      let list = this.$store.state.user && (this.displayChar ? this.$store.state.user.favoriteCharacters : this.$store.state.user.favoriteSeries)
      return list && list.flat() || []
    }
  }
}
