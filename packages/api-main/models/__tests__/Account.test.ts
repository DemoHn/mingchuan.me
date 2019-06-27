import { getInstance } from 'db-migrate'
import models from '../index'

describe('Model: Account', () => {
  const dbmigrate = getInstance(true)
  const { Account } = models

  const payload = {
    name: '这是一个支持汉字的账户',
    passwordHash: Buffer.from([1, 2, 3]),
    permissionMask: 0,
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
})
