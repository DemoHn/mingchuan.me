import { wrapRoute } from './_routes'
import { Request } from 'express'
import { createAccount, generateLoginJwt } from '../services/accountService'

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

export default {
  register: wrapRoute(registerFunc, registerSchema),
}
