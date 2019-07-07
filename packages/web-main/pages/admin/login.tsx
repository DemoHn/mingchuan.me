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
  flex-direction: column;
`

const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  padding-left: 25px;
  padding-right: 25px;
`

const Wrapper = styled.div`
  box-shadow: 0px 0px 3px 2px rgba(51, 51, 51, 0.15);
  border-radius: 4px;
  padding: 30px 20px;
`

const Banner = styled.div`
  font-size: 22px;
  text-align: center;
  font-family: OCR-A;
  margin-bottom: 25px;
  color: #294d05;
`
const LoginPage: NextFunctionComponent = () => {
  return (
    <MainContainer>
      <Banner>Admin Login</Banner>
      <FormContainer>
        <Wrapper>
          <LoginForm
            onLogin={data => {
              console.log(data)
            }}
          />
        </Wrapper>
      </FormContainer>
    </MainContainer>
  )
}

export default LoginPage
