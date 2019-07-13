import Post, { PostPayload } from '../models/Post'
import _ from 'lodash'
import Errors from '../utils/errors'

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
  type: string,
  content: string,
  options?: CreatePostOption
): Promise<Post> {
  const newPost: PostPayload = {
    title,
    type,
    content,
    status: (options && options.status) || PostStatus.PUBLISHED,
    permission: (options && options.permission) || PostPermission.PUBLIC,
  }

  return Post.create(newPost)
}

// update post info
export interface UpdatePostOptions {
  title?: string
  content?: string
}
export async function updatePostContent(
  post: Post,
  updateInfo: UpdatePostOptions
): Promise<Post> {
  return post.update(_.pickBy(updateInfo, _.identity))
}

// soft remove posts
export async function removePost(post: Post): Promise<Post> {
  return post.update({
    status: PostStatus.REMOVED,
  })
}

// get post (even status = 'REMOVED')
export async function getPostByID(id: number): Promise<Post> {
  const post = await Post.findByPk(id)
  if (!post) {
    throw Errors.newLogicError('PostNotFoundError', `post ${id} not found!`)
  }

  return post
}

export async function listAllPosts(
  cursorOption?: CursorOption
): Promise<[Post[], number]> {
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

  return [listResult.rows, listResult.count]
}

////// CLIENT (PUBLIC) handler
