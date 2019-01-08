import checkAuth from './check-auth'
import checkLogin from './check-login'

export default function(context) {
  const { route } = context
  const path = route.path
  // dispatch middlewares by url - that's the most simple
  // dispatcher!
  if (
    new RegExp('^/admin/login').test(path) ||
    new RegExp('^/admin/register').test(path)
  ) {
    checkLogin(context)
  } else if (new RegExp('^/admin').test(path)) {
    checkAuth(context)
  }
}
