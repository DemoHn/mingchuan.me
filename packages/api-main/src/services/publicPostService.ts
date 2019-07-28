// get post (even status = 'REMOVED')
import Post from '../models/Post'
import Errors from '../utils/errors'
import { Op } from 'sequelize'

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

// list posts
export async function listPublicPosts(
  limit?: number,
  cursor?: number
): Promise<[Post[], boolean, number]> {
  const MAX_LIMIT = 25
  const aLimit = limit && limit > 0 && limit <= MAX_LIMIT ? limit : MAX_LIMIT

  const publicPosts = await Post.findAll({
    limit: aLimit + 1,
    order: [['updated_at', 'DESC']],
    where: {
      ...(cursor
        ? {
            updatedAt: {
              [Op.lt]: cursor,
            },
          }
        : {}),
      status: 'PUBLISHED',
      permission: 'PUBLIC',
    },
  })

  const actualPosts = publicPosts.length > aLimit ? publicPosts.slice(0, -1) : publicPosts
  const hasMore = publicPosts.length > aLimit
  const aCursor = hasMore ? actualPosts[actualPosts.length - 1].updatedAt.getTime() : null
  return [actualPosts, hasMore, aCursor]
}
