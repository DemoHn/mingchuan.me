import React from 'react'
import { NextFunctionComponent } from 'next'
import AdminLayout from '../_layout'
import PostEditor from 'components/PostEditor'

const NewPostPage: NextFunctionComponent = () => {
  return (
    <AdminLayout routeKey="posts/new">
      <PostEditor />
    </AdminLayout>
  )
}

export default NewPostPage
