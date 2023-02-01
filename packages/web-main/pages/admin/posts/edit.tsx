import React from 'react'
import { NextPage } from 'next'
//// components
import AdminLayout from '../_layout'
import PostEditor, { SubmitPayload } from 'components/PostEditor'
import {
  PostResponse,
  adminGetOnePost,
  adminUpdatePostContent,
} from 'services/postService'
import { Request } from 'express'
import { message } from 'antd'

//// handlers
const handleSubmit = async (postID: number, data: SubmitPayload) => {
  const resp = await adminUpdatePostContent(postID, {
    title: data.title,
    content: data.content,
  })

  if (resp.isSuccess) {
    message.info(`更新「${data.title}」内容成功！`)
  } else {
    const body = resp.body as any
    message.error(`Error: ${body.message}`)
  }
}
//// props
export interface EditPostPageProps {
  id?: number
  post?: PostResponse
}

const EditPostPage: NextPage<EditPostPageProps> = props => {
  const postID = props.id as any
  const post = props.post as any
  const initialValue = {
    title: post.title,
    content: post.content || '',
    publishOptions: {
      public: post.permission === 'PUBLIC',
      draft: post.status === 'DRAFTED',
    },
  }
  return (
    <AdminLayout routeKey="posts/list">
      <PostEditor
        type="html"
        onSubmit={data => handleSubmit(postID, data)}
        editMode={true}
        initialValue={initialValue}
      />
    </AdminLayout>
  )
}

EditPostPage.getInitialProps = async (ctx) => {
  const query = ctx.query as any
  const postID = query.id ? parseInt(query.id, 10) : null
  if (postID) {
    const resp = await adminGetOnePost(postID, ctx.req as Request)
    if (resp.isSuccess) {
      return {
        post: resp.body as PostResponse,
        id: postID,
      }
    }
  }
  // else, return nothing
  return {}
}

export default EditPostPage
