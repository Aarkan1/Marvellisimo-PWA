export default {
  template: `
  <div>
    <h1>About page</h1>
    <button class="btn" @click="clickHandler">Click</button>
    <router-link to="/test-with-params/Text from link">From link</router-link>
  </div>
  `,
  methods: {
    clickHandler() {
      this.$router.push({path: '/test-with-params/' + 'From params'})
    }
  }
}
