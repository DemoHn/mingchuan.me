import React from 'react'
import styled from 'styled-components'
import { NextFunctionComponent } from 'next'
import 'antd/dist/antd.css'
// components
import LoginForm from 'components/LoginForm'
import { notification } from 'antd'
// services
import { login } from 'services/login'
import { JSONResponse } from 'services/_base'
import { storeToken } from 'services/token'

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
  color: #237804;
`

const handleResponse = (resp: JSONResponse): Promise<boolean> => {
  if (resp.isSuccess) {
    const { jwt }: any = resp.body
    storeToken(jwt)
  } else {
    const { name, message }: any = resp.body
    notification.open({
      message: name,
      description: message,
    })
  }
  return Promise.resolve(resp.isSuccess)
}

const handleFatalError = (err: Error): Promise<boolean> => {
  notification.open({
    message: 'FatalError',
    description: err.message,
  })
  return Promise.resolve(false)
}
const LoginPage: NextFunctionComponent = () => {
  return (
    <MainContainer>
      <Banner>Admin Login</Banner>
      <FormContainer>
        <Wrapper>
          <LoginForm
            onLogin={({ name, password }) =>
              login({ name, password })
                .then(handleResponse)
                .catch(handleFatalError)
            }
          />
        </Wrapper>
      </FormContainer>
    </MainContainer>
  )
}

export default LoginPage
