import { client, collUsers } from '../services/stitch.js'

export default {
  template: `
    <form @submit.prevent id="login-page" class="container">
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
    </form>
  `,
  data() {
    return {
      username: '',
      email: 'loke@loke.se',
      password: 'loke123'
    }
  },
  methods: {
    async login(registered = false) {
      const { UserPasswordCredential } = stitch

      const credential = new UserPasswordCredential(this.email, this.password)
      const user = await client.auth.loginWithCredential(credential)
      .catch(err => {
        console.error(err)
      })
    
      console.log("Signed in user:", user)
      // await db.collection('users').updateOne({owner_id: client.auth.user.id}, {$set:{number:42}}, {upsert:true})
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
    },
    async register() {
      const { UserPasswordAuthProviderClient } = stitch

      const emailPasswordClient = client.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
    
      const result = await emailPasswordClient.registerWithEmail(this.email, this.password)
      .catch(err => {
        console.error("Error registering new user:", err)
        return
      })

      console.log(result);

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