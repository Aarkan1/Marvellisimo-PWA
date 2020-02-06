export default {
  template: `
  <div id="home" class="container">
    <h1 class="marvel-logo">Marvellisimo</h1>
      
    <router-link to="/search">
    <button class="menu-item btn-flat waves-effect waves-light">
      <i class="material-icons">search</i>
      <p>Search</p>
    </button>
    </router-link>
    <router-link to="/recieved-messages">
    <button class="menu-item btn-flat waves-effect waves-light">
      <i class="material-icons">chat</i>
      <p>Recieved Messages</p>
    </button>
    </router-link>
    <router-link to="/friends">
    <button class="menu-item btn-flat waves-effect waves-light">
      <i class="material-icons">people_alt</i>
      <p>Friends</p>
    </button>
    </router-link>
    <router-link to="/favorites">
    <button class="menu-item btn-flat waves-effect waves-light">
      <i class="material-icons">favorite_border</i>
      <p>Favorites</p>
    </button>
    </router-link>
  </div>
  `,
  created() {
    this.$store.commit("setLogo", "Marvellisimo");
  }
};
