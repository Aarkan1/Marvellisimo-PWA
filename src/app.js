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
      return
    } 

    let user = await IDB.read('user-data', client.auth.user.id)
    console.log(user);
    
    this.$store.commit('setUser', user)

    setTimeout(async () => {
      user = await collUsers.findOne({ uid: client.auth.user.id }).catch(e => {
        M.toast({
          html: '<div class="toast-text">Currently offline</div>', 
          classes: 'toast', 
          displayLength: 2000
        })
        return
      })
      if(!user) return
      this.$store.commit('setUser', user)
      user.isOnline = true
      user && await collUsers.findOneAndReplace({ uid: user.uid }, user).catch(console.error)
      M.toast({
        html: '<div class="toast-text">Successfully signed in</div>', 
        classes: 'toast', 
        displayLength: 2000
      })
    }, 50);
  }
}
