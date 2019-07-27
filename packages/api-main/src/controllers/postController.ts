import { wrapRoute, AppRequest } from './_routes'
import {
  createPost,
  PostStatus,
  PostPermission,
  updatePostContent,
  getPostByID,
  removePost,
  listAllPosts,
  updatePostStatus,
  updatePostPermission,
} from '../services/postService'
import { getPostResponse, getPostsList } from '../transformers/post'

// admin create post
const createPostSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'content', 'type'],
    properties: {
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['html', 'markdown'],
      },
      status: {
        type: 'string',
        enum: ['PUBLISHED', 'DRAFTED'],
      },
      permission: {
        type: 'string',
        enum: ['PUBLIC', 'PRIVATE'],
      },
    },
  },
}
async function createPostFunc(req: AppRequest) {
  const { title, content, status, permission, type } = req.body
  const post = await createPost(title, type, content, {
    status: status || PostStatus.PUBLISHED,
    permission: permission || PostPermission.PUBLIC,
  })

  return getPostResponse(post)
}

// update content
const updatePostSchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
    },
  },
}
async function updatePostContentFunc(req: AppRequest) {
  const { id } = req.params
  const { title, content } = req.body

  const post = await getPostByID(id)
  const newPost = await updatePostContent(post, { title, content })

  return getPostResponse(newPost)
}
// update status
const updateStatusSchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      status: {
        enum: ['PUBLISHED', 'DRAFTED', 'REMOVED'],
      },
    },
  },
}
async function updateStatusFunc(req: AppRequest) {
  const { id } = req.params
  const { status } = req.body

  const post = await getPostByID(id)
  const newPost = await updatePostStatus(post, status)

  return getPostResponse(newPost)
}

const updatePermissionSchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  body: {
    type: 'object',
    additionalProperties: false,
    properties: {
      permission: {
        enum: ['PUBLIC', 'PRIVATE'],
      },
    },
  },
}
async function updatePermissionFunc(req: AppRequest) {
  const { id } = req.params
  const { permission } = req.body

  const post = await getPostByID(id)
  const newPost = await updatePostPermission(post, permission)

  return getPostResponse(newPost)
}

// delete post
const deleteSchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: {
        type: 'number',
      },
    },
  },
}
async function deletePostFunc(req: AppRequest) {
  const { id } = req.params

  const post = await getPostByID(id)
  const delPost = await removePost(post)

  return getPostResponse(delPost)
}

// get post by ID
// delete post
const getOneSchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
}
async function getOnePostFunc(req: AppRequest) {
  const { id } = req.params
  const post = await getPostByID(id)
  return getPostResponse(post)
}

// list posts
const listPostsSchema = {
  query: {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
      limit: {
        type: 'string',
      },
      page: {
        type: 'string',
      },
    },
  },
}
async function listAllPostsFunc(req: AppRequest) {
  const { limit, page } = req.query
  const Qlimit = limit ? parseInt(limit, 10) : undefined
  const Qpage = page ? parseInt(page, 10) : undefined
  const [posts, totalCount] = await listAllPosts({ limit: Qlimit, page: Qpage })
  return getPostsList(posts, totalCount)
}

export default {
  createPost: wrapRoute(createPostFunc, createPostSchema),
  updatePostContent: wrapRoute(updatePostContentFunc, updatePostSchema),
  deletePost: wrapRoute(deletePostFunc, deleteSchema),
  getOnePost: wrapRoute(getOnePostFunc, getOneSchema),
  listAllPosts: wrapRoute(listAllPostsFunc, listPostsSchema),
  updateStatus: wrapRoute(updateStatusFunc, updateStatusSchema),
  updatePermission: wrapRoute(updatePermissionFunc, updatePermissionSchema),
}
