import axios from 'axios'
import _ from 'lodash'

function getBaseUrl() {
  return '/api/v1'
}

async function basicRequest(
  baseUrl,
  authJwt,
  reqMethod,
  authSchema,
  reqUrl,
  params
) {
  const url = `${baseUrl}${reqUrl}`
  const headers = {
    'Auth-Schema': authSchema
  }

  // only non-public APIs would add authJwt
  if (authSchema && authSchema !== 'PUBLIC') {
    headers['Authorization'] = `Bearer ${authJwt}`
  }

  const finalParams = Object.assign(
    {},
    {
      method: reqMethod,
      headers
    },
    { url },
    params
  )
  const resp = await axios.request(finalParams)
  return resp
}

export default store => {
  // define request value
  const request = (reqMethod, authSchema, reqUrl, params) => {
    const baseUrl = getBaseUrl()
    const authJwt = _.get(store, 'state.user.jwt')

    return basicRequest(baseUrl, authJwt, reqMethod, authSchema, reqUrl, params)
  }

  return apiCollection => {
    const buildAPI = {}
    Object.keys(apiCollection).forEach(key => {
      const $func = apiCollection[key]
      buildAPI[key] = $func.bind({ request })
    })
    return buildAPI
  }
}

export const buildRequest = authJwt => {
  const request = (reqMethod, authSchema, reqUrl, params) => {
    const baseUrl = getBaseUrl()

    return basicRequest(baseUrl, authJwt, reqMethod, authSchema, reqUrl, params)
  }

  return request
}
