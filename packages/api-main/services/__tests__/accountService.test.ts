import { generateLoginJwt } from '../accountService'
import Account, { AccountPayload } from '../../models/Account'
import { getInstance } from 'db-migrate'
describe('service: accountService', () => {
  const dbmigrate = getInstance(true)

  var expAccount: Account
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

  test('should generateJWT', async () => {
    const jwt = await generateLoginJwt(expAccount, '1h')

    expect(jwt).not.toEqual(null)
  })
})
