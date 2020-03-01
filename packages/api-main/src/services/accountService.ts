// components
//import { generateKeyPair } from 'crypto'
const crypto = require('crypto')
import { promisify } from 'util'
import { v4 as uuid } from 'uuid'
import { sign, decode, verify } from 'jsonwebtoken'
// services
import { generatePassowrdHash, verifyPasswordHash } from './tokenService'
// models
import Account, { AccountPayload } from '../models/Account'
import LoginToken, { LoginTokenPayload } from '../models/LoginToken'

// utils
import Errors from '../utils/errors'

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
    throw Errors.newLogicError('NotExistAccountError', `account ${name} not found`)
  }

  const verifyResult = await verifyPasswordHash(password, account.passwordHash)
  if (verifyResult) {
    return account
  } else {
    throw Errors.newLogicError('WrongPasswordError', `password mismatch`)
  }
}

export async function findAccountByID(id: number): Promise<Account> {
  const account = await Account.findByPk(id)
  if (!account) {
    throw Errors.newLogicError('AccountNotFoundError', `account: ${name} not exists`)
  }

  return account
}

export async function updatePassword(
  account: Account,
  newPassword: string
): Promise<Account> {
  const passwordHash = await generatePassowrdHash(newPassword)
  return account.update({ passwordHash })
}

export async function updateUsername(
  account: Account,
  newUsername: string
): Promise<Account> {
  return account.update({ name: newUsername })
}

// jwt related helpers
export async function verifyLoginJwt(loginJwt: string): Promise<Record<string, any>> {
  const payload: any = decode(loginJwt)
  // find token record
  if (!payload.deviceIdentifier) {
    throw Errors.newLogicError(
      'VerifyJwtError',
      'malformed jwt structure: missing deviceIdentifier'
    )
  }

  const token = await LoginToken.findOne({
    where: { deviceIdentifier: payload.deviceIdentifier },
  })
  if (!token) {
    throw Errors.newLogicError('VerifyJwtError', 'token key not found')
  }

  // verify token
  try {
    await verify(loginJwt, token.publicKey)
  } catch (error) {
    throw Errors.newLogicError('VerifyJwtError', error)
  }

  // check if account matches
  if (token.accountID !== payload.accountID) {
    throw Errors.newLogicError(
      'VerifyJwtError',
      `accountID from payload: ${payload.accountID} mismatch`
    )
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
  const { publicKey, privateKey } = await promisify(crypto.generateKeyPair)('rsa', {
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
    name: account.name,
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
