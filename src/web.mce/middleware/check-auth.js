import authService from '../services/auth'

export default function(context) {
  const { redirect, store, req } = context
  const jwt = process.client
    ? authService.getSessionFromLocalStorage()
    : authService.getSessionFromCookie(req)

  if (!jwt) {
    redirect('/admin/login')
    return
  }

  const user = authService.getUserFromJwt(jwt)
  if (!user) {
    redirect('/admin/login')
    return
  }
  store.commit('user/setUser', user)
  store.commit('user/setCredential', jwt)
}
