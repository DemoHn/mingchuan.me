import React from 'react'
import { NextFunctionComponent } from 'next'
import styled from 'styled-components'
import PostTitle from 'components/PostTitle'

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
  margin-bottom: 20px;
`

export interface IndexPageProps {
  posts: {
    title: string
    postLink: string
    createTime: number
  }[]
}

const IndexPage: NextFunctionComponent<IndexPageProps> = props => {
  const { posts } = props
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

IndexPage.getInitialProps = async () => {
  return Promise.resolve({
    posts: [
      {
        postLink: '/posts/1',
        title: 'Hello',
        createTime: 1000,
      },
      {
        postLink: '/posts/2',
        title: 'Hellos',
        createTime: 1000,
      },
    ],
  })
}

export default IndexPage
