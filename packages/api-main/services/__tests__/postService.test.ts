import { getInstance } from 'db-migrate'
import { createPost, PostStatus, PostPermission } from '../postService'

describe('service: postService -> Create', () => {
  const dbmigrate = getInstance(true)

  beforeAll(async () => {
    await dbmigrate.up()
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  // Create
  test('should create new post /default options', async () => {
    const expTitle = 'First Title'
    const expContent = '<p>blog content</p>'

    const post = await createPost(expTitle, expContent)

    expect(post).toMatchObject({
      title: expTitle,
      content: expContent,
      status: PostStatus.PUBLISHED,
      permission: PostPermission.PUBLIC,
    })
  })

  test('should create new post /with options', async () => {
    const expTitle = 'First Title'
    const expContent = '<p>blog content</p>'

    const post = await createPost(expTitle, expContent, {
      status: PostStatus.DRAFTED,
      permission: PostPermission.PRIVATE,
    })

    expect(post).toMatchObject({
      title: expTitle,
      content: expContent,
      status: PostStatus.DRAFTED,
      permission: PostPermission.PRIVATE,
    })
  })
})

describe('service: postService -> Remove', () => {
  const dbmigrate = getInstance(true)

  beforeAll(async () => {
    await dbmigrate.up()
  })

  afterAll(async () => {
    await dbmigrate.down()
  })
})
