import Post, { PostPayload } from '../models/Post'
import _ from 'lodash'
import Errors from '../utils/errors'
import {
  PostsList,
  getPostsList,
  PostResponse,
  getPostResponse,
} from '../transformers/post'

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFTED = 'DRAFTED',
  REMOVED = 'REMOVED',
}
export enum PostPermission {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
export interface CreatePostOption {
  status: PostStatus
  permission: PostPermission
}
export interface CursorOption {
  limit?: number
  offset?: number
}

///// ADMIN handler
// create
export async function createPost(
  title: string,
  content: string,
  options?: CreatePostOption
): Promise<PostResponse> {
  const newPost: PostPayload = {
    title,
    content,
    status: (options && options.status) || PostStatus.PUBLISHED,
    permission: (options && options.permission) || PostPermission.PUBLIC,
  }

  const p = await Post.create(newPost)
  return getPostResponse(p)
}

// update post info
export interface UpdatePostOptions {
  title?: string
  content?: string
}
export async function updatePostContent(
  post: Post,
  updateInfo: UpdatePostOptions
): Promise<PostResponse> {
  const p = await post.update(_.pickBy(updateInfo, _.identity))
  return getPostResponse(p)
}

// soft remove posts
export async function removePost(post: Post): Promise<PostResponse> {
  const p = await post.update({
    status: PostStatus.REMOVED,
  })

  return getPostResponse(p)
}

// get post (even status = 'REMOVED')
export async function getPostByID(id: number): Promise<PostResponse> {
  const post = await Post.findByPk(id)
  if (!post) {
    throw Errors.newLogicError('PostNotFoundError', `post ${id} not found!`)
  }

  return getPostResponse(post)
}

export async function listAllPosts(cursorOption?: CursorOption): Promise<PostsList> {
  const MAX_LIMIT = 25
  const offset = (cursorOption && cursorOption.offset) || 0
  const limit =
    (cursorOption &&
      cursorOption.limit &&
      cursorOption.limit > 0 &&
      cursorOption.limit <= MAX_LIMIT &&
      cursorOption.limit) ||
    MAX_LIMIT

  const listResult = await Post.findAndCountAll({
    attributes: ['id', 'title', 'status', 'permission', 'createdAt', 'updatedAt'],
    offset,
    limit,
    order: [['updated_at', 'DESC']],
  })

  return getPostsList(listResult.rows, listResult.count)
}

////// CLIENT (PUBLIC) handler
