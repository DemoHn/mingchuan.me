export default {
  // TODO: use apiBuilder
  createPost: async function (postData) {
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
  updatePost: async function (id, postData) {
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
  listPost: async function () {
    const { request } = this
    const result = await request('get', 'PUBLIC', '/posts/')
    console.log(result)
    return result.data.posts.map(item => {
      const model = {
        isDraft: item.status === 'DRAFTED',
        title: item.title,
        id: item.id,
        createdAt: (new Date(item.createdAt)).getTime(),
        updatedAt: (new Date(item.updatedAt)).getTime()
      }

      return model
    })
  },
  getOnePost: async function (postID) {
    const { request } = this
    const result = await request('get', 'ADMIN', `/admin/posts/${postID}`)
    const data = result.data

    const model = {
      id: data.id,
      title: data.title,
      content: data.content,
    }

    return model
  }
}
