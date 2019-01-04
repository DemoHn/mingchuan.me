import authService from '../services/auth'

export default function(context) {
  const { redirect, req, route } = context

  const jwt = process.client
    ? authService.getSessionFromLocalStorage()
    : authService.getSessionFromCookie(req)

  // suppose url = /admin/login?r=/admin/indexPage
  // if jwt exists, redirect to /admin/indexPage
  let redirectPage = route.query.r || '/admin'

  if (jwt) {
    redirect(redirectPage)
  }
}
