export default {
  // TODO: use apiBuilder
  createPost: async function(postData) {
    const { request } = this
    const { title, content, isDraft } = postData
    const result = await request('post', 'ADMIN', '/admin/posts/', {
      data: {
        title,
        content,
        status: isDraft ? 'DRAFTED' : 'PUBLISHED',
        permission: 'PUBLIC'
      }
    })
    return result
  },
  updatePost: async function(id, postData) {
    const { request } = this
    const { title, content, isDraft } = postData
    const result = await request('patch', 'ADMIN', `/admin/posts/${id}`, {
      data: {
        title,
        content,
        status: isDraft ? 'DRAFTED' : 'PUBLISHED',
        permission: 'PUBLIC'
      }
    })
    return result
  },
  // TODO [for backend]: more professional API!
  listPost: async function(limit, cursor) {
    const { request } = this
    const result = await request('get', 'ADMIN', '/admin/posts/', {
      cursor,
      limit
    })

    return result.data.posts.map(item => {
      const model = {
        isDraft: item.status === 'DRAFTED',
        title: item.title,
        id: item.id,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime()
      }

      return model
    })
  },
  listPublicPosts: async function(limit, cursor) {
    const { request } = this
    const result = await request('get', 'PUBLIC', '/posts', {
      cursor,
      limit
    })

    return result.data.posts.map(item => {
      const model = {
        title: item.title,
        id: item.id,
        createdAt: new Date(item.createdAt).getTime(),
        updatedAt: new Date(item.updatedAt).getTime()
      }

      return model
    })
  },
  getOnePublicPost: async function(postID) {
    const { request } = this
    const result = await request('get', 'PUBLIC', `/posts/${postID}`)

    const data = result.data
    const model = {
      id: data.id,
      title: data.title,
      content: data.content,
      updatedAt: new Date(data.updatedAt * 1000).getTime(),
      createdAt: new Date(data.createdAt * 1000).getTime()
    }

    return model
  },
  getOnePost: async function(postID) {
    const { request } = this
    const result = await request('get', 'ADMIN', `/admin/posts/${postID}`)
    const data = result.data

    const model = {
      id: data.id,
      title: data.title,
      content: data.content
    }

    return model
  }
}
