import { collUsers } from '../services/stitch.js'

export const store = new Vuex.Store({
  state: {
    timeoutDuration: 1000 * 5,
    user: null,
    logo: 'Marvellisimo',
    characterList: [],
    serieList: [],
    isMobile: true,
    dataToSend: null
  },
  mutations: {
    setDataToSend(state, data) {
      state.dataToSend = data
    },
    setMobile(state, mobile) {
      state.isMobile = mobile
    },
    async setUser(state, user) {
      state.user = {...user}
      user && await IDB.write('user-data', user)

      user && await IDB.write('user-data', {
        uid: 'active-user',
        id: user.uid || ''
      })
      localStorage['active-user'] = user.uid || ''
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
