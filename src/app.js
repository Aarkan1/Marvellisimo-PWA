import navbar from './components/navbar.js'
import { client, collUsers } from './services/stitch.js'

export default {
  components: {
    navbar,
  },
  template: `
    <div id="app">
      <navbar />
      <main class="container">
        <transition enter-active-class="animated slideInUp" mode="out-in">  
          <router-view class="animation-speed" :key="$route.fullPath" />
        </transition>
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
      console.log("Logged in:", result);
    }
  }
}
