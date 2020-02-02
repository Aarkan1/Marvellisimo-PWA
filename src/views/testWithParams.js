export default {
  template: `
  <div>
    <h1>Home page</h1>
    <p>{{ text }}</p>
  </div>
  `,
  data() {
    return {
      text: 'some text'
    }
  },
  created() {
    this.text = this.$route.params.text
  }
}