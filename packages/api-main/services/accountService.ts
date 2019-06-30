// components
import { generateKeyPair } from 'crypto'
import { promisify } from 'util'
import { v4 as uuid } from 'uuid'
import { sign } from 'jsonwebtoken'
// services
import { generatePassowrdHash } from './tokenService'
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

// jwt related helpers
export async function generateJWT(
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

  await LoginToken.create(createTokenPayload)

  return sign(jwtPayload, privateKey, {
    algorithm: 'RS256',
    expiresIn,
    issuer: 'mingchuan.me',
  })
}
