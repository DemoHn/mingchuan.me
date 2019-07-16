import React from 'react'
import PostItem from './PostItem'
import { PostResponse } from 'services/postService'
import { OperationAction } from './PostItem/Operation'
//// props

export interface PostListProps {
  posts: PostResponse[]
  onOperationAction: (id: number, action: OperationAction) => any
}

const PostList: React.FC<PostListProps> = props => {
  const { posts, onOperationAction } = props
  return (
    <>
      {posts.map(post => (
        <PostItem
          key={post.id}
          post={post}
          onOperationAction={action => onOperationAction(post.id, action)}
        />
      ))}
    </>
  )
}

export default PostList
