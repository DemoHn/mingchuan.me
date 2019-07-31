import { getInstance } from 'db-migrate'
import LoginToken, { LoginTokenPayload } from '../LoginToken'

describe('Model: LoginToken', () => {
  const dbmigrate = getInstance(true)

  const payload: LoginTokenPayload = {
    accountID: 1,
    publicKey: 'key',
    deviceIdentifier: 'port',
  }

  beforeAll(async () => {
    await dbmigrate.up()
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  test('should create LoginToken()', async () => {
    const token = await LoginToken.create(payload)
    expect(token).toMatchObject(payload)
  })
})
