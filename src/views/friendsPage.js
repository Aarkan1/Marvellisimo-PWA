import { collUsers } from '../services/stitch.js'

export default {
  template: `
    <div id="friends-page" class="container">
    <div class="switch">
      <label>
        Offline
        <input v-model="onlineFriends" type="checkbox">
        <span class="lever"></span>
        Online
      </label>
    </div>
      <h3>{{ onlineFriends ? 'Online' : 'Offline' }}</h3>

      <ul>
        <li v-for="friend in filteredFriends" :key="friend.uid">{{ friend.username }}</li>
      </ul>
    </div>
  `,
  data() {
    return {
      onlineFriends: true,
      friends: []
    }
  },
  computed: {
    filteredFriends() {
      return this.friends.filter(friend => friend.isOnline == this.onlineFriends)
    }
  },
  async created() {
    this.friends = await collUsers.find().asArray()
  }
}