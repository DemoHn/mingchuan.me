import React from 'react'
import { NextFunctionComponent } from 'next'
import AdminLayout from '../_layout'
import PostEditor, { SubmitPayload } from 'components/PostEditor'
import { adminCreatePost } from 'services/postService'
import { message } from 'antd'

const NewPostPage: NextFunctionComponent = () => {
  const handleSubmit = async (data: SubmitPayload) => {
    return adminCreatePost(data)
      .then(resp => {
        if (resp.isSuccess) {
          message.success('create post succeed!')
        } else {
          const body = resp.body as any
          message.warning(`${body.name}: ${body.message}`)
        }
      })
      .catch((err: Error) => {
        message.error(`FatalError: ${err.message}`)
      })
  }
  return (
    <AdminLayout routeKey="posts/new">
      <PostEditor type="html" onSubmit={handleSubmit} editMode={false} />
    </AdminLayout>
  )
}

export default NewPostPage
