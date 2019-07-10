import fetch from 'isomorphic-unfetch'
import { getTokenFromCookie, getTokenFromLocalStorage } from './token'

import { Request as ExpressRequest } from 'express'

export interface RequestPayload {
  query?: Record<string, any>
  body?: Record<string, any>
}

export interface JSONResponse {
  isSuccess: boolean
  statusCode: number
  body?: Record<string, any>
}

export async function baseRequest(
  method: string,
  url: string,
  payload?: RequestPayload,
  serverReq?: ExpressRequest
): Promise<Response> {
  const token = serverReq ? getTokenFromCookie(serverReq) : getTokenFromLocalStorage()

  var requestURL = serverReq
    ? `${serverReq.protocol}://${serverReq.headers.host}${url}`
    : url

  const options: any = { method }
  // add body
  if (payload && payload.body && method.toUpperCase() !== 'GET') {
    options.body = JSON.stringify(payload.body)
  }
  // add auth header
  if (token) {
    options.headers = {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    }
  }
  // add querystring
  if (payload && payload.query) {
    requestURL = `${requestURL}${buildQuerystring(payload.query)}`
  }
  return fetch(requestURL, options)
}

export async function jsonRequest(
  method: string,
  url: string,
  payload?: RequestPayload,
  serverReq?: ExpressRequest
): Promise<JSONResponse> {
  return baseRequest(method, url, payload, serverReq).then(async resp => {
    const result = await resp.json()
    return {
      isSuccess: resp.ok,
      statusCode: resp.status,
      body: result,
    }
  })
}

// helper function
function buildQuerystring(qs: Record<string, any>) {
  const qsArray = []
  for (var key in qs) {
    const qsItem = `${encodeURIComponent(key)}=${encodeURIComponent(qs[key])}`
    qsArray.push(qsItem)
  }

  return qsArray.length > 0 ? `?${qsArray.join('&')}` : ''
}
