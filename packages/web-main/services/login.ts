import { jsonRequest, JSONResponse } from './_base'

// since login API will be used in client ONLY
// so we omit `serverReq`
export interface LoginRequest {
  name: string
  password: string
}

export async function login(body: LoginRequest): Promise<JSONResponse> {
  const payload = { body }
  return jsonRequest('POST', '/api/accounts/login', payload)
}
