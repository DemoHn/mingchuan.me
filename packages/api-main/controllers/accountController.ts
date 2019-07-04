import Ajv from 'ajv'
import { Request, Response } from 'express'
import { createAccount, generateLoginJwt } from '../services/accountService'

const ajv = new Ajv()

const registerSchema = {
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
}
export async function register(req: Request, res: Response) {
  const validate = ajv.compile(registerSchema)
  const valid = validate(req.body)

  if (!valid) {
    throw new Error('invalid input')
  }
  const { name, password } = req.body
  const account = await createAccount(name, password, 'admin') // hard core first
  const jwt = await generateLoginJwt(account, '24h')
  res.json({ jwt })
}
