import { getInstance } from 'db-migrate'
import models from '../index'

describe('Model: Post', () => {
  const dbmigrate = getInstance(true)
  const { Post } = models

  beforeAll(async () => {
    await dbmigrate.up()
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  const payload = {
    title: 'This is another post',
    content: '<p>content</p>',
    status: 'PUBLISHED',
    permission: 'PUBLIC',
  }

  test('should create Post()', async () => {
    const post = await Post.create(payload)
    expect(post).toMatchObject(payload)
  })
})
