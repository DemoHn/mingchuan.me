import { getInstance } from 'db-migrate'
import Account, { AccountPayload } from '../Account'
import { ValidationError } from 'sequelize'

describe('Model: Account', () => {
  const dbmigrate = getInstance(true)

  const payload: AccountPayload = {
    name: '这是一个支持汉字的账户',
    passwordHash: Buffer.from([1, 2, 3]),
  }
  beforeAll(async () => {
    await dbmigrate.up()
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  test('should create Account()', async () => {
    const acct = await Account.create(payload)
    expect(acct).toMatchObject(payload)
  })

  test('should find one Account()', async () => {
    const result = await Account.findOne({
      where: {
        permissionMask: 0,
      },
    })

    expect(result).toMatchObject(payload)
  })

  test('should throw error: UniqueError', async () => {
    const missingPayload = {
      name: 'Account',
    }

    await expect(Account.create(missingPayload)).rejects.toThrow(ValidationError)
  })
})
