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

const FormContainer = styled.div`
  width: 100%;
  max-width: 350px;
`
const LoginPage: NextFunctionComponent = () => {
  return (
    <MainContainer>
      <FormContainer>
        <LoginForm
          onLogin={data => {
            console.log(data)
          }}
        />
      </FormContainer>
    </MainContainer>
  )
}

export default LoginPage
