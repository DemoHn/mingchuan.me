import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 60px;
  width: 100%;
  box-shadow: 0px 4px 4px -4px rgba(122, 122, 122, 0.45);
`

const Wrapper = styled.div`
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled.div`
  font-size: 19px;
  font-family: OCR-A;
  color: #222;
`

const SubText = styled.div`
  color: #9a9a9acc;
  letter-spacing: 5px;
`
const Header: React.FC = () => {
  return (
    <Container>
      <Wrapper>
        <a href="/">
          <Logo>mingchuan.me</Logo>
        </a>
        <SubText>這個世界的異鄉人</SubText>
      </Wrapper>
    </Container>
  )
}

export default Header
