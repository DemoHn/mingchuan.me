import Post from '../models/Post'

export interface PublicPost {
  title: string
  content: string
  createTime: number
  lastUpdateTime: number
}

export interface PublicPostBrief {
  title: string
  createTime: number
  lastUpdateTime: number
}

export interface PublicPostsList {
  hasMore: boolean
  cursor?: number
  posts: PublicPostBrief[]
}

export function getPublicPost(post: Post): PublicPost {
  return {
    title: post.title,
    content: post.content,
    createTime: post.createdAt.getTime(),
    lastUpdateTime: post.updatedAt.getTime(),
  }
}

export function getPublicPostsList(
  posts: Post[],
  hasMore: boolean,
  cursor?: number
): PublicPostsList {
  return {
    hasMore,
    cursor,
    posts: posts.map(post => ({
      title: post.title,
      createTime: post.createdAt.getTime(),
      lastUpdateTime: post.updatedAt.getTime(),
    })),
  }
}
