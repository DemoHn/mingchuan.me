// get post (even status = 'REMOVED')
import Post from '../models/Post'
import Errors from '../utils/errors'

export async function getPublicPostByID(id: number): Promise<Post> {
  const post: Post = await Post.findByPk(id)
  if (!post) {
    throw Errors.newLogicError('PostNotFoundError', `post ${id} not found!`)
  }
  if (post.permission !== 'PUBLIC') {
    throw Errors.newLogicError('PrivatePostError', `post ${id} is private!`)
  }
  if (post.status !== 'PUBLISHED') {
    throw Errors.newLogicError('PublishedPostError', `post ${id} is not published!`)
  }
  return post
}
