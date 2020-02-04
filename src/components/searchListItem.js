export default {
  template: `
    <div @click="goToDetails" class="card small waves-effect waves-light">
      <div class="card-image">
        <img class="" :src="data.thumbnail.path + '.' + data.thumbnail.extension" />
      </div>
      <div class="card-content">
      <span class="card-title">
        {{ data.name || data.title }}
      </span> 
      </div>
    </div>
  `,
  props: ['data', 'char'],
  methods: {
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