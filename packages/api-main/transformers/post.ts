import Post from '../models/Post'

export interface PostResponse {
  title: string
  content: string
  status: string
  permission: string
  createTime: number
  lastUpdateTime: number
}

export function getPostResponse(post: Post): PostResponse {
  return {
    title: post.title,
    content: post.content,
    status: post.status,
    permission: post.permission,
    createTime: post.createdAt.getTime(),
    lastUpdateTime: post.updatedAt.getTime(),
  }
}

// for public posts, some properties (like status, permission)
// could be hidden
export interface PublicPostResponse {
  title: string
  content: string
  createTime: number
  lastUpdateTime: number
}

export function getPublicPostResponse(post: Post): PublicPostResponse {
  return {
    title: post.title,
    content: post.content,
    createTime: post.createdAt.getTime(),
    lastUpdateTime: post.updatedAt.getTime(),
  }
}

// for posts list, we only need title & its status to speed up response time
export interface PostsList {
  posts: {
    title: string
    status: string
    permission: string
    createTime: number
    lastUpdateTime: number
  }[]
  totalCount?: number
}
export function getPostsList(posts: Post[], count?: number): PostsList {
  const dPosts = posts.map(p => ({
    title: p.title,
    status: p.status,
    permission: p.permission,
    createTime: p.createdAt.getTime(),
    lastUpdateTime: p.updatedAt.getTime(),
  }))

  return {
    posts: dPosts,
    totalCount: count,
  }
}
