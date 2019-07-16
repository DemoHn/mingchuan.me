import React from 'react'
import PostItem from './PostItem'
import { PostResponse } from 'services/postService'
//// props

export interface PostListProps {
  posts: PostResponse[]
}

const PostList: React.FC<PostListProps> = props => {
  const { posts } = props
  return (
    <>
      {posts.map(post => (
        <PostItem key={post.id} post={post} onOperationAction={() => {}} />
      ))}
    </>
  )
}

export default PostList
