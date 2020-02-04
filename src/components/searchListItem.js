export default {
  template: `
    <div @click="goToDetails" class="card small waves-effect waves-light">
      <div class="card-image">
        <img :src="data.thumbnail.path.replace('http:', 'https:') + '.' + data.thumbnail.extension" />
      </div>
      <div class="card-content">
      <span class="card-title">
        {{ data.name || data.title }}
      </span> 
      <i @click.stop="updateFavorite" class="material-icons">{{ isFavorited ? 'favorite' : 'favorite_border'}}</i>
      </div>
    </div>
  `,
  props: ['data', 'char'],
  computed: {
    isFavorited() {
      if(!this.$store.state.user) return

      let isChar = !!this.data.name
      return this.$store.state.user[isChar ? 'favoriteCharacters' : 'favoriteSeries']
        .filter(charID => charID == this.data.id).length > 0
    }
  },
  methods: {
    updateFavorite() {
      let isChar = !!this.data.name
      let list = this.$store.state.user[isChar ? 'favoriteCharacters' : 'favoriteSeries']
      if(this.isFavorited) {
        list.splice(list.indexOf(this.data.id), 1)
      } else {
        !list.includes(this.data.id) && list.push(this.data.id)
      }
      this.$store.dispatch('updateUser')
      this.$emit('updateFavorite', this.data.id)
    },
    goToDetails() {
      this.$router.push({
        path: '/details/' + this.data.id,
        query: {
          char: this.char
        }
      })
    }
  }
}