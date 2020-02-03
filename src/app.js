import navbar from './components/navbar.js'
import { client, collUsers } from './libs/stitch.js'

export default {
  components: {
    navbar,
  },
  template: `
    <div id="app">
      <navbar />
      <main class="container">
        <router-view />
      </main>
    </div>
  `,
  async created() {
    M.AutoInit()

    if(!client.auth.isLoggedIn) {
      this.$router.replace("/login")
    } else {
      const result = await collUsers.findOne({ uid: client.auth.user.id }).catch(console.error)
      this.$store.commit('setUser', result)
      result.isOnline = true
      result && await collUsers.findOneAndReplace({ uid: result.uid }, result).catch(console.error)
    }
  }
}
