import { getMarvels } from '../services/marvelProvider.js'

export const store = new Vuex.Store({
  state: {
    user: null,
    logo: 'Marvellisimo',
    characterList: [],
    serieList: []
  },
  mutations: {
    async setUser(state, user) {
      state.user = user

      state.user.favoriteCharacters = await Promise.all(state.user.favoriteCharacters.map(async charID => await getMarvels('characters', '', charID)))
      state.user.favoriteSeries = await Promise.all(state.user.favoriteSeries.map(async serieID => await getMarvels('series', '', serieID)))
    },   
    setLogo(state, logo) {
      state.logo = logo
    },
    setCharacterList(state, characterList) {
      state.characterList = [...characterList]
    },
    setSerieList(state, serieList) {
      state.serieList = [...serieList]
    },
  }
})
