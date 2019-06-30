// components
import { generateKeyPair } from 'crypto'
import { promisify } from 'util'
import { v4 as uuid } from 'uuid'
import { sign, decode, verify } from 'jsonwebtoken'
// services
import { generatePassowrdHash, verifyPasswordHash } from './tokenService'
// models
import Account, { AccountPayload } from '../models/Account'
import LoginToken, { LoginTokenPayload } from '../models/LoginToken'

export async function createAccount(
  name: string,
  password: string,
  accountType: string
): Promise<Account> {
  const hash = await generatePassowrdHash(password)

  const createPayload: AccountPayload = {
    name,
    passwordHash: hash,
    permissionMask: accountType === 'admin' ? 1 : 0, // TODO: need better impl
  }

  return Account.create(createPayload)
}

export async function verifyAccount(name: string, password: string): Promise<Account> {
  // find account by name
  const account = await Account.findOne({ where: { name } })
  if (!account) {
    throw new Error('account not found')
  }

  const verifyResult = await verifyPasswordHash(password, account.passwordHash)
  if (verifyResult) {
    return account
  } else {
    throw new Error('password mismatch')
  }
}

// jwt related helpers
export async function verifyLoginJwt(loginJwt: string): Promise<Record<string, any>> {
  const payload: any = decode(loginJwt)
  // find token record
  if (!payload.deviceIdentifier) {
    throw new Error('malformed jwt')
  }

  const token = await LoginToken.findOne({
    where: { deviceIdentifier: payload.deviceIdentifier },
  })
  if (!token) {
    throw new Error('invalid token')
  }

  // verify token
  await verify(loginJwt, token.publicKey)
  // check if account matches
  if (token.accountID !== payload.accountID) {
    throw new Error('accountID mismatch')
  } else {
    return payload
  }
}

export async function generateLoginJwt(
  account: Account,
  expiresIn: string,
  deviceIdentifier?: string
): Promise<string> {
  // generate key pair
  const { publicKey, privateKey } = await promisify(generateKeyPair)('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  })

  const idf = deviceIdentifier || uuid()
  const jwtPayload = {
    accountID: account.id,
    deviceIdentifier: idf,
  }

  // insert new LoginToken
  const createTokenPayload: LoginTokenPayload = {
    accountID: account.id,
    publicKey,
    deviceIdentifier: idf,
  }
  await upsertLoginToken(createTokenPayload)

  return sign(jwtPayload, privateKey, {
    algorithm: 'RS256',
    expiresIn,
    issuer: 'mingchuan.me',
  })
}

// helper
async function upsertLoginToken(payload: LoginTokenPayload) {
  const tokenRecord = await LoginToken.findOne({
    where: { deviceIdentifier: payload.deviceIdentifier },
  })

  if (tokenRecord) {
    return tokenRecord.update(payload)
  } else {
    return LoginToken.create(payload)
  }
}
