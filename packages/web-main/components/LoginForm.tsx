import React, { useCallback, useState } from 'react'
import { Form, Input, Button, Icon } from 'antd'
import styled from 'styled-components'

// styles
const LoginSuccessBar = styled.div`
  width: 100%;
  background-color: #389e0d;
  color: white;
  height: 30px;
  line-height: 28px;
  font-weight: 400;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  text-align: center;
  border-radius: 4px;
`
export interface LoginFormProps {
  onLogin: (input: { name: string; password: string }) => Promise<boolean> // return if success
  form: any
}

const LoginForm: React.FC<LoginFormProps> = props => {
  const { onLogin } = props
  const [isLoading, setLoading] = useState(false)
  const [isLoginSuccess, setLoginSuccess] = useState(false)

  const { getFieldDecorator, validateFields } = props.form
  const formItemProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleSubmit = useCallback((e: any) => {
    e.preventDefault()
    setLoading(true)
    validateFields(async (err: any, values: any) => {
      if (err) {
        // not handle error first
        setLoading(false)
        return
      }
      const result = await onLogin(values)
      if (result) {
        setLoginSuccess(true)
      } else {
        setLoading(false)
      }
    })
  }, [])
  return (
    <Form
      layout="horizontal"
      labelAlign="right"
      style={{ width: '100%' }}
      onSubmit={handleSubmit}
    >
      <Form.Item label="username:" {...formItemProps}>
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'username is required' }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="password" {...formItemProps}>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'password is required' }],
        })(<Input type="password" />)}
      </Form.Item>

      <Form.Item>
        {isLoginSuccess ? (
          <LoginSuccessBar>
            <Icon type="check" />
            <span style={{ marginLeft: '6px' }}>Success</span>
          </LoginSuccessBar>
        ) : isLoading ? (
          <Button loading type="primary" style={{ width: '100%' }}>
            <span>Loading</span>
          </Button>
        ) : (
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Login
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}

const WLoginForm = Form.create<LoginFormProps>({
  name: 'login_form',
})(LoginForm)

export default WLoginForm
