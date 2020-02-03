import test from './test.js'

export const store = new Vuex.Store({
  modules: {
    test
  },
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }    
  }
})
