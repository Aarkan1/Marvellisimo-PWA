import { client, collUsers } from '../services/stitch.js'

export default {
  template: `
  <div class="navbar-fixed">
    <nav class="nav-wrapper">
      <router-link v-if="showBackArrow" to="/"><i class="material-icons">arrow_back</i></router-link>
      <p v-else id="arrow-placeholder"></p>
      <h5>{{ $store.state.logo }}</h5>
      <i class="material-icons" @click="signOut()">exit_to_app</i>
    </nav>
  </div>
  `,
  computed: {
    showBackArrow() {
      return this.$route.path != '/' && this.$route.path != '/login'
    }
  },
  methods: {
    async signOut() {
      this.$store.state.user && (this.$store.state.user.isOnline = false)
      this.$store.state.user && await collUsers.findOneAndReplace(
        { uid: this.$store.state.user.uid },
         this.$store.state.user
        ).catch(console.error)

      client.auth.logout()
      this.$store.commit('setUser', null)
      console.log("Logging out");

      this.$router.push("/login")
    }
  }
}