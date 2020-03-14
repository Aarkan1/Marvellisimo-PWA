import { client, collUsers } from '../services/stitch.js'
import { subToNotifications } from '../services/notifications.js'

export default {
  template: `
    <form @submit.prevent="login()" id="login-page" class="container" autocomplete="off">
      <h1 class="marvel-logo">Marvellisimo</h1>
      <div class="input-field">
        <input id="username" placeholder="Username" v-model="username" type="text" class="validate">
      </div>
      <div class="input-field">
        <input id="email" placeholder="Email" v-model="email" type="email" class="validate">
      </div>
      <div class="input-field">
        <input id="password" placeholder="Password" v-model="password" type="password" class="validate">
      </div>
      <div class="login-buttons">
        <button class="btn" @click="login()">login</button>
        <button class="btn" @click="register()">register</button>
      </div>
      <div v-if="loggingIn" class="spinner login-spinner">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-yellow-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
    </form>
  `,
  data() {
    return {
      username: '',
      email: '',
      password: '',
      loggingIn: false
    }
  },
  methods: {
    async login(registered = false) {
      this.loggingIn = true
      const { UserPasswordCredential } = stitch

      const credential = new UserPasswordCredential(this.email, this.password)
      const user = await client.auth.loginWithCredential(credential)
      .catch(err => {
        this.loggingIn = false
        M.toast({
          html: '<div class="toast-text">Bad username/password</div>', 
          classes: 'toast', 
          displayLength: 2000
        })
        console.error(err)
      })
    
      console.log("Signed in user:", user)
      let result;

      if(registered) {
        result =  await this.createNewUser(user.id)
      } else {
        result = await collUsers.findOne({ uid: client.auth.user.id })
        .catch(err => {
          console.error(err)
        })
        console.log("Found user:", result)

        result.isOnline = true
        result && await collUsers.findOneAndReplace({ uid: result.uid }, result).catch(console.error)
      }
      
      subToNotifications()
      this.$store.commit('setUser', result)
      this.$router.replace("/")
    },
    async register() {
      const { UserPasswordAuthProviderClient } = stitch

      const emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
    
      const result = await emailPasswordClient.registerWithEmail(this.email, this.password)
      .catch(err => {
        M.toast({
          html: '<div class="toast-text">Bad username/password</div>', 
          classes: 'toast', 
          displayLength: 2000
        })
        console.error("Error registering new user:", err)
        return
      })

      M.toast({
        html: '<div class="toast-text">Successfully registered</div>', 
        classes: 'toast', 
        displayLength: 2000
      })

      this.login(true)
    },
    async createNewUser(id) {
      const newUser = {
        _id: new stitch.BSON.ObjectId(id),
        uid: id,
        username: this.username,
        email: this.email,
        isOnline: true,
        favoriteSeries: [],
        favoriteCharacters: []
      }

      return await collUsers.insertOne(newUser)
      .catch(err => {
        console.error("Error creating new user:", err)
      })
    }
  },
  created() {
    if(client.auth.isLoggedIn) {
      this.$router.replace("/")
    }
  },
  mounted() {
    M.updateTextFields()
  }
}