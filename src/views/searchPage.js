export default {
  template: `
    <div>
      <div class="input-field col s6">
        <i class="material-icons prefix">search</i>
        <input id="icon_prefix" type="text" class="validate">
        <label for="icon_prefix">Search</label>
      </div>

      <ul>
        <li v-for="item of searchHistory" :key="item">{{ item }}</li>
      </ul>
    </div>
  `,
  data() {
    return {
      searchHistory: []
    }
  },
  created() {
    // const searchHistory = [
    //   'spider-man',
    //   'ant',
    //   'hulk'
    // ]
    // localStorage.setItem("search-history", JSON.stringify(searchHistory))
    this.searchHistory = JSON.parse(localStorage.getItem("search-history"))
    console.log("Search history:", this.searchHistory);
    
  }
}