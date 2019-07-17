import React from 'react'
import { NextFunctionComponent } from 'next'
import styled from 'styled-components'

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

const IndexPage: NextFunctionComponent = () => {
  return (
    <MainContainer>
      <TitleBox>
        <Title>mingchuan.me</Title>
        <Motto>這個世界的異鄉人</Motto>
      </TitleBox>
    </MainContainer>
  )
}

export default IndexPage
