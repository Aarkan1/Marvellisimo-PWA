import { client, collUsers, collSubs } from '../services/stitch.js'
import { subToNotifications } from '../services/notifications.js'

export default {
  template: `
    <div id="login-page" class="container" autocomplete="off">
      <h1 class="marvel-logo">Marvellisimo</h1>
      <div class="input-field">
        <input id="username" placeholder="Username" v-model="username" type="text" class="validate">
      </div>
      <div class="input-field">
        <input id="email" placeholder="Email" v-model="email" type="email" class="validate">
      </div>
      <div class="input-field">
        <input id="password" @keyup.enter.prevent.stop="login()" placeholder="Password" v-model="password" type="password" class="validate">
      </div>
      <div class="login-buttons">
        <button class="btn" @click.prevent.stop="login()">login</button>
        <button class="btn" @click.prevent.stop="register()">register</button>
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
    </div>
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
    async login(registered) {
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
      
      this.$store.commit('setUser', result)
      this.$router.replace("/")

      await subToNotifications()
      let idbSub = await IDB.read('user-data', 'sub-id')
      if(idbSub) {
        let sub = await collSubs.findOne({ uid: idbSub.id })
        if(!sub.userIds.includes(client.auth.user.id)) sub.userIds.push(client.auth.user.id)
        await collSubs.findOneAndReplace({ uid: idbSub.id }, sub).catch(console.error)
      }
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
    console.log('Mounting LoginPage');
    
    if(client.auth.isLoggedIn) {
      this.$router.replace("/")
    }
  },
  mounted() {
    M.updateTextFields()
  }
}