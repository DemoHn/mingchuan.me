import React from 'react'
import { Layout } from 'antd'
import 'antd/dist/antd.css'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
`
const ContentWrapper = styled.div`
  padding: 20px 50px;
`

const AdminLayout: React.FC = props => {
  const { Header, Content, Footer, Sider } = Layout
  return (
    <Container>
      <Layout>
        <Header>header</Header>
        <Content>
          <ContentWrapper>
            <Layout>
              <Sider>233</Sider>
              <Content>{props.children}</Content>
            </Layout>
          </ContentWrapper>
        </Content>
        <Footer>
          <span>
            Credit by <a href="https://mingchuan.me">DemoHn</a> - 2019
          </span>
        </Footer>
      </Layout>
    </Container>
  )
}

export default AdminLayout
