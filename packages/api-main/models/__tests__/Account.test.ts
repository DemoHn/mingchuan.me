import { getInstance } from 'db-migrate'
import models from '../index'

describe('Model: Account', () => {
  const dbmigrate = getInstance(true)
  beforeAll(async () => {
    await dbmigrate.up()
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  test('should create Account()', async () => {
    const acct = await models.Account.create({
      name: 'A',
      passwordHash: Buffer.from([1, 2, 3]),
      permissionMask: 0,
    })

    expect(acct).toHaveProperty('name', 'A')
  })
})
