import React from 'react'
import { NextPageContext, NextPage } from 'next'
import styled from 'styled-components'
import PostTitle from 'components/PostTitle'
import { Request } from 'express'
import { getPublicPostsList } from 'services/postService'

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 1200px;
`

const VerticalContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
`

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-family: OCR-A, monospace;
  font-size: 36px;
`

const Motto = styled.div`
  margin-top: 8px;
  font-size: 18px;
  color: #666;
  letter-spacing: 2px;
`

const PostHeader = styled.div`
  font-family: OCR-A, monospace;
  font-size: 20px;
  margin-bottom: 25px;
`

export interface IndexPageProps {
  posts: {
    title: string
    postLink: string
    createTime: number
  }[]
}

const IndexPage: NextPage<IndexPageProps> = props => {
  var { posts } = props
  if (!posts) {
    posts = []
  }
  return (
    <MainContainer>
      <VerticalContainer>
        <TitleBox>
          <Title>mingchuan.me</Title>
          <Motto>這個世界的異鄉人</Motto>
        </TitleBox>
      </VerticalContainer>
      <VerticalContainer>
        <PostHeader>Recent Posts</PostHeader>
        {posts.map(post => (
          <PostTitle {...post} />
        ))}
      </VerticalContainer>
    </MainContainer>
  )
}

IndexPage.getInitialProps = async (ctx) => {
  const req = ctx.req as Request
  const result = await getPublicPostsList(
    {
      limit: 10,
      cursor: null,
    },
    req
  )

  if (result.isSuccess) {
    const body = result.body as any
    return {
      posts: body.posts.map(p => ({
        postLink: `/posts/${p.id}`,
        title: p.title,
        createTime: p.createTime,
      })),
    }
  }
  return { posts: [] }
}

export default IndexPage
