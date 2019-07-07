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

// create
export async function createPost(
  title: string,
  content: string,
  options?: CreatePostOption
): Promise<Post> {
  const newPost: PostPayload = {
    title,
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

// get post (even status = 'REMOVED')
export async function getPostByID(id: number): Promise<Post> {
  const post = await Post.findByPk(id)
  if (!post) {
    throw Errors.newLogicError('PostNotFoundError', `post ${id} not found!`)
  }

  return post
}

// soft remove posts
export async function removePost(post: Post): Promise<Post> {
  return post.update({
    status: PostStatus.REMOVED,
  })
}
