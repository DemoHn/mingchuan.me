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

const Box = styled.div`
  font-family: OCR-A;
  font-size: 20px;
`
const Index: NextFunctionComponent = () => {
  return <MainContainer>
    <Box>
      mingchuan.me
    </Box>
  </MainContainer>
}

export default Index
