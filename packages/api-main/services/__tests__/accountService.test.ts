import {
  createAccount,
  verifyAccount,
  generateLoginJwt,
  verifyLoginJwt,
} from '../accountService'
import Account, { AccountPayload } from '../../models/Account'
import { decode } from 'jsonwebtoken'
import { getInstance } from 'db-migrate'
describe('service: accountService', () => {
  const dbmigrate = getInstance(true)

  var expAccount: Account
  var expJWT: string
  beforeAll(async () => {
    await dbmigrate.up()
    const acctPayload: AccountPayload = {
      name: '1234',
      passwordHash: Buffer.from([1, 2, 3, 4]),
    }

    expAccount = await Account.create(acctPayload)
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  test('should create account', async () => {
    const expName = 'name01'
    const expPassword = 'password'
    const account = await createAccount(expName, expPassword, 'admin')

    expect(account).toMatchObject({
      name: expName,
      permissionMask: 1,
    })
  })

  test('should verify account with same password', async () => {
    const expName = 'name01'
    const expPassword = 'password'

    const res = await verifyAccount(expName, expPassword)
    expect(res).toMatchObject({
      name: expName,
      permissionMask: 1,
    })
  })

  test('should verify account failed /incorrect password', async () => {
    const expName = 'name01'
    const expPassword = 'password--wrong'

    await expect(verifyAccount(expName, expPassword)).rejects.toThrow('password mismatch')
  })

  test('should verify account failed /account not found', async () => {
    const expName = 'name01-not-found'
    const expPassword = 'password--wrong'

    await expect(verifyAccount(expName, expPassword)).rejects.toThrow('account not found')
  })

  // login jwt
  test('should generate login jwt /new token', async () => {
    const jwt = await generateLoginJwt(expAccount, '1h')
    expJWT = jwt
    const payload = decode(jwt)
    expect(payload).toMatchObject({
      accountID: expAccount.id,
    })
    expect(payload).toHaveProperty('deviceIdentifier')
  })

  test('should generate login jwt /refresh token', async () => {
    const oldDeviceID = '1234-5678'
    const jwt = await generateLoginJwt(expAccount, '1h', oldDeviceID)

    const payload = decode(jwt)
    expect(payload).toMatchObject({
      accountID: expAccount.id,
      deviceIdentifier: oldDeviceID,
    })
  })

  test('should verifyLoginJwt', async () => {
    const payload = await verifyLoginJwt(expJWT)

    expect(payload).toMatchObject({
      accountID: expAccount.id,
    })
  })
})
