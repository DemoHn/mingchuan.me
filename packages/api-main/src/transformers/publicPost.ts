import Post from '../models/Post'

export interface PublicPost {
  title: string
  content: string
  createTime: number
  lastUpdateTime: number
}

export function getPublicPost(post: Post): PublicPost {
  return {
    title: post.title,
    content: post.content,
    createTime: post.createdAt.getTime(),
    lastUpdateTime: post.updatedAt.getTime(),
  }
}
