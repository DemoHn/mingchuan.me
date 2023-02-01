import React from 'react'
import { NextPage } from 'next'
import Header from 'components/Header'
import PostContent from 'components/PostContent'

import styled from 'styled-components'
import { Request } from 'express'
import { getPublicPost } from 'services/postService'
import { displayTimestamp } from 'utils/formatDate'

//// styles
const Content = styled.div`
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 1024px;
`

const Title = styled.div`
  font-size: 30px;
  line-height: 1.25;
  margin-bottom: 0.5em;
`
const PostMeta = styled.div`
  font-size: 17px;
  font-style: italic;
  color: #999;
  margin-bottom: 2.25em;
`

//// props
export interface PostPageProps {
  post?: {
    title: string
    content: string
    lastUpdateTime: number
    createTime: number
  }
}

const PostPage: NextPage<PostPageProps> = props => {
  const post = props.post as any
  const current = Date.now()
  const timeStr = post.lastUpdateTime === post.createTime
    ? `创建于 ${displayTimestamp(post.createTime, current)}`
    : `最后编辑于 ${displayTimestamp(post.lastUpdateTime, current)}`
  return (
    <section>
      <Header />
      <Content>
        <Title>{post.title}</Title>
        <PostMeta>{timeStr}</PostMeta>
        <PostContent content={post.content} contentType="html"></PostContent>
      </Content>
    </section>
  )
}

PostPage.getInitialProps = async (ctx) => {
  const req = ctx.req as Request
  const query = ctx.query as any
  const result = await getPublicPost(query.id, req)

  if (result.isSuccess) {
    const body = result.body as any
    return {
      post: {
        title: body.title,
        content: body.content,
        createTime: body.createTime,
        lastUpdateTime: body.lastUpdateTime,
      },
    }
  }

  return {}
}
export default PostPage
