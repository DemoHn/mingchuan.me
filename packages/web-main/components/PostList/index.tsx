import React from 'react'
import PostItem, { PostItemProps } from './PostItem'
//// props

export interface PostListProps {
  posts: PostItemProps[]
}

const PostList: React.FC = () => {
  const props = {
    title: '233-XXY',
    status: 'DRAFTED',
    permission: 'PUBLIC',
    createTime: Date.now(),
    lastUpdateTime: 1572342435000,
  }
  return <PostItem {...props} />
}

export default PostList
