export default {
  template: `
    <div>
      <h3>{{ greeting }}</h3>
    </div>
  `,
  computed: {
    greeting() {
      return this.$store.state.test.greeting
    }
  }
}