import { getInstance } from 'db-migrate'
import Post, { PostPayload } from '../Post'

describe('Model: Post', () => {
  const dbmigrate = getInstance(true)

  beforeAll(async () => {
    await dbmigrate.up()
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  const payload: PostPayload = {
    title: 'This is another post',
    type: 'html',
    content: '<p>content</p>',
    status: 'PUBLISHED',
    permission: 'PUBLIC',
  }

  test('should create Post()', async () => {
    const post = await Post.create(payload)
    expect(post).toMatchObject(payload)
  })
})
