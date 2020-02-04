import { client, collUsers } from '../services/stitch.js'

export default {
  template: `
  <div class="navbar-fixed">
    <nav class="nav-wrapper">
      <router-link to="/"><i class="material-icons">arrow_back</i></router-link>
      <h5>{{ $store.state.logo }}</h5>
      <i class="material-icons" @click="signOut()">exit_to_app</i>
    </nav>
  </div>
  `,
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