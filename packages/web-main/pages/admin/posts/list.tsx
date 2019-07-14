import React from 'react'
import { NextFunctionComponent } from 'next'
import PostList from 'components/PostList'
import AdminLayout from '../_layout'

const ListPostPage: NextFunctionComponent = () => {
  return (
    <AdminLayout routeKey="posts/list">
      <PostList />
      <PostList />
    </AdminLayout>
  )
}

export default ListPostPage
