import navbar from './components/navbar.js'

export default {
  components: {
    navbar,
  },
  template: `
    <div id="app" class="container">
      <navbar />
      <router-view />
    </div>
  `,
  created() {
    M.AutoInit()
  }
}
