import React from 'react'
import styled from 'styled-components'
import { NextFunctionComponent } from 'next'
import 'antd/dist/antd.css'

// components
import LoginForm from 'components/LoginForm'

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoginPage: NextFunctionComponent = () => {
  return (
    <MainContainer>
      <LoginForm />
    </MainContainer>
  )
}

export default LoginPage
