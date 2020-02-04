import navbar from './components/navbar.js'
import { client, collUsers } from './services/stitch.js'

export default {
  components: {
    navbar,
  },
  template: `
    <div id="app">
      <navbar />
      <main>
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
      let user = await IDB.read('user-data', client.auth.user.id)
      console.log(user);
      
      this.$store.commit('setUser', user)

      setTimeout(async () => {
        user = await collUsers.findOne({ uid: client.auth.user.id }).catch(e => {
          return
        })
        if(!user) return
        this.$store.commit('setUser', user)
        user.isOnline = true
        user && await collUsers.findOneAndReplace({ uid: user.uid }, user).catch(console.error)
        console.log("Logged in:", user);
      }, 50);
    }
  }
}
