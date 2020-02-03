import { client, collUsers } from '../libs/stitch.js'

export default {
  template: `
    <nav>
      <router-link to="/">home</router-link> |
      <router-link to="/recieved-messages">recieved messages</router-link> |
      <router-link to="/friends">friends</router-link> |
      <router-link to="/favorites">favorites</router-link>
      <button class="btn btn-flat" @click="signOut()"><i class="material-icons">exit_to_app</i></button>
    </nav>
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