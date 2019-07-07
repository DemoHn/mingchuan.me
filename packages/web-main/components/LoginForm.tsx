import React, { useCallback } from 'react'
import { Form, Input, Button } from 'antd'

export interface LoginFormProps {
  onLogin: (input: { name: string; password: string }) => any
  form: any
}

const LoginForm: React.FC<LoginFormProps> = props => {
  const { onLogin } = props
  const { getFieldDecorator, validateFields } = props.form
  const formItemProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleSubmit = useCallback((e: any) => {
    e.preventDefault()

    validateFields((_: any, values: any) => {
      onLogin(values)
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
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}

const WLoginForm = Form.create<LoginFormProps>({
  name: 'login_form',
})(LoginForm)

export default WLoginForm
