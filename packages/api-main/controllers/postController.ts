import { wrapRoute, AppRequest } from './_routes'
import {
  createPost,
  PostStatus,
  PostPermission,
  updatePostContent,
  getPostByID,
  removePost,
} from '../services/postService'
import { getPostResponse } from '../transformers/post'

// admin create post
const createPostSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['title', 'content'],
    properties: {
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['PUBLISHED', 'DRAFTED', 'REMOVED'],
      },
      permission: {
        type: 'string',
        enum: ['PUBLIC', 'PRIVATE'],
      },
    },
  },
}
async function createPostFunc(req: AppRequest) {
  const { title, content, status, permission } = req.body
  const post = await createPost(title, content, {
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
        type: 'number',
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

export default {
  createPost: wrapRoute(createPostFunc, createPostSchema),
  updatePostContent: wrapRoute(updatePostContentFunc, updatePostSchema),
  deletePost: wrapRoute(deletePostFunc, deleteSchema),
}
