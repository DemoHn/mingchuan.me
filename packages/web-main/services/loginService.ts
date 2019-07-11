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

export async function updatePassword(newPassword: string): Promise<JSONResponse> {
  return jsonRequest('PATCH', '/api/accounts/password', { body: { newPassword } })
}

export async function updateUsername(newUsername: string): Promise<JSONResponse> {
  return jsonRequest('PATCH', '/api/accounts/username', { body: { newUsername } })
}
