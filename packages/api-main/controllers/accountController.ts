import { wrapRoute, AppRequest } from './_routes'
import {
  createAccount,
  verifyAccount,
  generateLoginJwt,
  updatePassword,
  findAccountByID,
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
  const jwt = await generateLoginJwt(account, '7d')
  return { jwt }
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

export default {
  register: wrapRoute(registerFunc, registerSchema),
  login: wrapRoute(loginFunc, loginSchema),
  updatePassword: wrapRoute(updatePasswordFunc, updatePasswordSchema),
}
