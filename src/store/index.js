import { collUsers } from '../services/stitch.js'

export const store = new Vuex.Store({
  state: {
    timeoutDuration: 1000 * 10,
    user: null,
    logo: 'Marvellisimo',
    characterList: [],
    serieList: []
  },
  mutations: {
    async setUser(state, user) {
      state.user = {...user}
      await IDB.write('user-data', user)
    },   
    setLogo(state, logo) {
      state.logo = logo
    },
    setCharList(state, list) {
      state.characterList = [...list]
    },
    setSerieList(state, list) {
      state.serieList = [...list]
    }
  },
  actions: {
    async updateUser(store) {
      store.state.user && await collUsers.findOneAndReplace({ uid: store.state.user.uid }, store.state.user).catch(console.error)
      store.commit('setUser', store.state.user)
    }
  }
})
