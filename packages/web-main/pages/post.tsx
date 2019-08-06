import React from 'react'
import { NextFunctionComponent, NextContext } from 'next'
import Header from 'components/Header'
import PostContent from 'components/PostContent'

import styled from 'styled-components'
import { Request } from 'express'
import { getPublicPost } from 'services/postService'

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
  line-height: 1.5;
  margin-bottom: 20px;
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

const PostPage: NextFunctionComponent<PostPageProps> = props => {
  const post = props.post as any
  return (
    <section>
      <Header />
      <Content>
        <Title>{post.title}</Title>
        <PostContent content={post.content} contentType="html"></PostContent>
      </Content>
    </section>
  )
}

PostPage.getInitialProps = async (ctx: NextContext) => {
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
