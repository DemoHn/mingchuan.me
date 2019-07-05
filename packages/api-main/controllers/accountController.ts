import { wrapRoute } from './_routes'
import { Request } from 'express'
import {
  createAccount,
  verifyAccount,
  generateLoginJwt,
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
async function registerFunc(req: Request) {
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
async function loginFunc(req: Request) {
  const { name, password } = req.body
  const account = await verifyAccount(name, password)
  const jwt = await generateLoginJwt(account, '7d')
  return { jwt }
}

export default {
  register: wrapRoute(registerFunc, registerSchema),
  login: wrapRoute(loginFunc, loginSchema),
}
