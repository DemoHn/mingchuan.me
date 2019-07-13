import React, { useState, useCallback } from 'react'
import { NextFunctionComponent } from 'next'
import styled from 'styled-components'
import AdminLayout from '../_layout'
import { decode } from 'jsonwebtoken'
// services
import { updatePassword, updateUsername } from 'services/loginService'
import { Input, Button, message } from 'antd'
import { getTokenFromCookie, getTokenFromLocalStorage } from 'services/tokenService'

// styles
const FormContainer = styled.div`
  width: 400px;
`
const FormColumn = styled.div`
  display: flex;
  width: 100%;
  min-height: 30px;
  line-height: 30px;
  margin-bottom: 15px;
  align-items: center;
`

const FormLabel = styled.span`
  width: 80px;
  text-align: right;
  margin-right: 10px;
`

const UsernameLabel = styled.span`
  margin-right: 10px;
  color: #08979c;
  text-decoration: underline;
`
export interface PageProps {
  name: string
}
const UpdatePasswordPage: NextFunctionComponent<PageProps> = props => {
  const { name } = props
  // edit password flag
  const [editPasswod, setEditPassword] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // edit username flag
  const [editUsername, setEditUsername] = useState(false)
  const [usernameInput, setUsernameInput] = useState(name)
  const [usernameLoading, setUsernameLoading] = useState(false)

  // handlers
  const submitNewPassword = useCallback(async () => {
    // loading first
    setPasswordLoading(true)
    return updatePassword(passwordInput)
      .then(resp => {
        if (resp.isSuccess) {
          message.success('Update password successfully!')
        } else {
          const body = resp.body as any
          message.warning(`${body.name}: ${body.message}`)
        }
        setPasswordLoading(false)
        setEditPassword(false)
        return
      })
      .catch((err: Error) => {
        message.error(`FatalError: ${err.message}`)
        setPasswordLoading(false)
        setEditPassword(false)
      })
  }, [passwordInput])

  const submitNewUsername = useCallback(async () => {
    // loading first
    setUsernameLoading(true)
    return updateUsername(usernameInput)
      .then(resp => {
        if (resp.isSuccess) {
          message.success('Update username successfully!')
        } else {
          const body = resp.body as any
          message.warning(`${body.name}: ${body.message}`)
        }
        setUsernameLoading(false)
        setEditUsername(false)
        return
      })
      .catch((err: Error) => {
        message.error(`FatalError: ${err.message}`)
        setUsernameLoading(false)
        setEditUsername(false)
      })
  }, [usernameInput])
  return (
    <AdminLayout routeKey="accounts/updatePassword">
      <FormContainer>
        <FormColumn>
          <FormLabel>用户名:</FormLabel>
          {editUsername ? (
            <>
              <Input
                value={usernameInput}
                style={{ width: '120px', marginRight: '10px' }}
                onChange={(e: any) => setUsernameInput(e.target.value)}
              />
              {usernameLoading ? (
                <Button loading={true} size="small" />
              ) : (
                <Button size="small" onClick={submitNewUsername}>
                  保存修改
                </Button>
              )}
            </>
          ) : (
            <span>
              <UsernameLabel>{usernameInput}</UsernameLabel>
              <Button size="small" icon="edit" onClick={() => setEditUsername(true)} />
            </span>
          )}
        </FormColumn>
        <FormColumn>
          <FormLabel>密码:</FormLabel>
          {editPasswod ? (
            <span>
              <Input
                value={passwordInput}
                type="password"
                style={{ width: '120px', marginRight: '10px' }}
                onChange={(e: any) => setPasswordInput(e.target.value)}
              />
              {passwordLoading ? (
                <Button loading={true} size="small" />
              ) : (
                <Button size="small" onClick={submitNewPassword}>
                  保存修改
                </Button>
              )}
            </span>
          ) : (
            <span>
              <Button size="small" onClick={() => setEditPassword(true)}>
                修改密码
              </Button>
            </span>
          )}
        </FormColumn>
      </FormContainer>
    </AdminLayout>
  )
}

UpdatePasswordPage.getInitialProps = (ctx: any) => {
  const req = ctx.req as any
  const authToken = req ? getTokenFromCookie(req) : getTokenFromLocalStorage()

  const payload = decode(authToken) as any
  return {
    name: payload ? payload.name : null,
  }
}

export default UpdatePasswordPage
