import Cookie from 'js-cookie'
import { Request } from 'express'

const LOGIN_TOKEN_KEY = 'mingchuan_me_admin_login_token'
export async function storeToken(token: string) {
  // on client side env
  if (typeof window !== 'undefined') {
    const localStorage = window.localStorage
    localStorage.setItem(LOGIN_TOKEN_KEY, token)
  }

  Cookie.set(LOGIN_TOKEN_KEY, token, {
    expires: 7, // 7 days
  })
}

export async function clearToken() {
  if (typeof window !== 'undefined') {
    const localStorage = window.localStorage
    localStorage.removeItem(LOGIN_TOKEN_KEY)
  }

  Cookie.remove(LOGIN_TOKEN_KEY)
}

export async function getTokenFromCookie(req: Request) {
  if (!req.headers.cookie) return null
  // parse cookies
  const cookiesStr = req.headers.cookie.split(';')

  const cookieDict: Record<string, any> = {}
  cookiesStr.forEach(cookie => {
    const [key, val] = cookie.trim().split('=')
    cookieDict[key] = val
  })
  return cookieDict[LOGIN_TOKEN_KEY]
}

export async function getTokenFromLocalStorage() {
  // 01. find from cookie first
  if (typeof window !== 'undefined') {
    const localStorage = window.localStorage
    return localStorage.getItem(LOGIN_TOKEN_KEY)
  }

  return null
}
