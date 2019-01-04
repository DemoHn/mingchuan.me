import { buildRequest } from '../helpers/apiBuilder'
import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'

export default {
  requestLogin: async (username, password) => {
    const request = buildRequest(null)
    const result = await request('post', 'PUBLIC', '/accounts/login', {
      data: {
        name: username,
        password,
      }
    })

    const { jwt } = result.data
    return jwt
  },
  requestRegister: async(username, password, adminKey) => {
    const request = buildRequest(null)
    const result = await request('post', 'PUBLIC', '/accounts/register-admin', {
      data: {
        name: username,
        password,
        adminKey,
      }
    })

    const { jwt } = result.data
    return jwt
  },
  // both from window.localStorage
  // make sure this function is run from frontend
  storeSession: (jwt) => {
    if (process.browser) {
      const localStorage = window.localStorage
      localStorage.setItem('secret', jwt)
    }

    Cookie.set('secret', jwt)
  },

  clearSession: () => {
    Cookie.remove('secret')
    if (process.browser) {
      const localStorage = window.localStorage
      localStorage.removeItem('secret')
    }
  },
  getSessionFromLocalStorage: () => {
    // 01. find from cookie first
    if (process.browser) {
      const localStorage = window.localStorage
      return localStorage.getItem('secret')
    }

    return null
  },

  getSessionFromCookie: (req) => {
    if (!req.headers.cookie)
      return null
    // parse cookies
    const cookiesStr = req.headers.cookie.split(';')

    const cookieDict = {}
    cookiesStr.forEach(cookie => {
      const [key, val] = cookie.trim().split('=')
      cookieDict[key] = val
    })
    return cookieDict['secret']
  },

  getUserFromJwt: (jwt) => {
    return jwtDecode(jwt)
  }
}

