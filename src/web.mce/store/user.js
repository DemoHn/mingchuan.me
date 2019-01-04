import authService from '../services/auth'

export const state = () => ({
  user: null,
  jwt: null,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setCredential(state, jwt) {
    state.jwt = jwt
  }
}

export const getters = {
  isAuthenticated: state => {
    return !!state.user
  }
}

export const actions = {
  async login({ commit }, { username, password }) {
    const jwt = await authService.requestLogin(username, password)
    authService.storeSession(jwt)
    const user = authService.getUserFromJwt(jwt)

    commit('setUser', user)
    commit('setCredential', jwt)
    return jwt
  },
  async register({ commit }, { username, password, adminKey }) {
    const jwt = await authService.requestRegister(username, password, adminKey)
    authService.storeSession(jwt)
    const user = authService.getUserFromJwt(jwt)

    commit('setUser', user)
    commit('setCredential', jwt)
    return jwt
  },
  logout({ commit }) {
    authService.clearSession()
    commit('setUser', null)
    commit('setCredential', null)
  }
}
