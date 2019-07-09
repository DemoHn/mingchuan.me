import { getInstance } from 'db-migrate'
import {
  createPost,
  PostStatus,
  PostPermission,
  removePost,
  getPostByID,
  listAllPosts,
} from '../postService'
import Post from '../../models/Post'

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

  let expPost: Post
  beforeAll(async () => {
    await dbmigrate.up()

    // create fixtures
    expPost = await Post.create({
      title: 'title-01',
      content: 'exp-content',
      status: PostStatus.DRAFTED,
      permission: PostPermission.PRIVATE,
    })
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  test('should remove a post', async () => {
    const newPost = await removePost(expPost)
    expect(newPost).toMatchObject({
      status: PostStatus.REMOVED,
    })
  })

  test('should get one post by ID /even if removed', async () => {
    const p = await getPostByID(expPost.id)
    expect(p).toMatchObject({
      status: p.status,
      title: p.title,
    })
  })
})

describe('service: postService -> ListAll', () => {
  const dbmigrate = getInstance(true)

  let expPosts: Post[]
  beforeAll(async () => {
    await dbmigrate.up()

    // create fixtures
    expPosts = await Post.bulkCreate([
      {
        title: 'title-01',
        content: 'exp-content',
        status: PostStatus.DRAFTED,
        permission: PostPermission.PRIVATE,
      },
      {
        title: 'title-02',
        content: 'exp-content',
        status: PostStatus.PUBLISHED,
        permission: PostPermission.PUBLIC,
      },
    ])
  })

  afterAll(async () => {
    await dbmigrate.down()
  })

  test('should list all posts /no limit', async () => {
    const [posts, count] = await listAllPosts()
    expect(count).toHaveProperty('totalCount', expPosts.length)
    expect(posts).toHaveLength(2)
  })

  test('should list all posts /limit = 1', async () => {
    const [posts, count] = await listAllPosts({ limit: 1 })
    expect(count).toHaveProperty('totalCount', expPosts.length)
    expect(posts).toHaveLength(1)
    // ensure there is only keys
    expect(Object.keys(posts[0])).toEqual([
      'id',
      'title',
      'status',
      'permission',
      'createTime',
      'lastUpdateTime',
    ])
  })
})
