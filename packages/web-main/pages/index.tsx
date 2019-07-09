import React from 'react'
import { NextFunctionComponent } from 'next'
import styled from 'styled-components'
import fetch from 'isomorphic-unfetch'

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TitleBox = styled.div`
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-family: OCR-A, monospace;
  font-size: 32px;
`

const Motto = styled.div`
  margin-top: 8px;
  font-size: 16px;
  color: #666;
  letter-spacing: 2px;
`

const Index: NextFunctionComponent = () => {
  return (
    <MainContainer>
      <TitleBox>
        <Title>mingchuan.me</Title>
        <Motto>這個世界的異鄉人</Motto>
      </TitleBox>
    </MainContainer>
  )
}

Index.getInitialProps = async (ctx: any) => {
  const req = ctx.req
  const baseUrl = req ? `${req.protocol}://${req.headers.host}` : ''

  const res = await fetch(baseUrl + '/api/admin/posts/1')
  console.log(res)
  return {}
}

export default Index
