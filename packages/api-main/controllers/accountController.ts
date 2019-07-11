import { wrapRoute, AppRequest } from './_routes'
import {
  createAccount,
  verifyAccount,
  generateLoginJwt,
  updatePassword,
  findAccountByID,
  verifyLoginJwt,
} from '../services/accountService'

// register account controller
const registerSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'password'],
    properties: {
      name: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  },
}
async function registerFunc(req: AppRequest) {
  const { name, password } = req.body
  const account = await createAccount(name, password, 'admin') // hard core first
  const jwt = await generateLoginJwt(account, '24h')
  return { jwt }
}

// login
const loginSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'password'],
    properties: {
      name: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  },
}
async function loginFunc(req: AppRequest) {
  const { name, password } = req.body
  const account = await verifyAccount(name, password)
  // get existing token for replacing new token with same deviceIdentifier
  const authHeader = req.get('authorization')
  return authHeader && /Bearer (.+)$/.test(authHeader)
    ? verifyLoginJwt(authHeader.slice(7))
        .then(payload => generateLoginJwt(account, '7d', payload.deviceIdentifier))
        .catch(() => generateLoginJwt(account, '7d'))
        .then(jwt => ({ jwt }))
    : generateLoginJwt(account, '7d').then(jwt => ({ jwt }))
}

// update password
const updatePasswordSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['newPassword'],
    properties: {
      newPassword: {
        type: 'string',
      },
    },
  },
}
async function updatePasswordFunc(req: AppRequest) {
  const { newPassword } = req.body
  const { accountID } = req.authPayload as any

  const account = await findAccountByID(accountID)
  await updatePassword(account, newPassword)

  return { success: true }
}

// verify login token
async function verifyTokenFunc() {
  // after auth, it should return success only
  return { success: true }
}
export default {
  register: wrapRoute(registerFunc, registerSchema),
  login: wrapRoute(loginFunc, loginSchema),
  updatePassword: wrapRoute(updatePasswordFunc, updatePasswordSchema),
  verifyToken: wrapRoute(verifyTokenFunc, {}),
}
