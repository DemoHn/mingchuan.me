import React from 'react'
import { Layout, Icon } from 'antd'
import 'antd/dist/antd.css'
import styled from 'styled-components'

// components
import AdminMenu from 'components/AdminMenu'

// resources
import menuConfig from './menu.config'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
`

const ContentContainer = styled.div`
  display: flex;
  background-color: #fff;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  min-height: 640px;
  max-width: 1200px;
  width: 100%;
`

const Sider = styled.div`
  height: 100%;
  width: 280px;
  border-right: 1px solid #ccc;
  flex-shrink: 1;
`

const InnerContent = styled.div`
  height: 100%;
  width: 100%;
`
const layoutStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
  },
  footer: {
    textAlign: 'center',
  } as any,
}

// props
export interface AdminLayoutProps {
  routeKey: string
}

const AdminLayout: React.FC<AdminLayoutProps> = props => {
  const currentYear = new Date().getFullYear()
  const { Header, Footer } = Layout
  const { routeKey } = props
  return (
    <Container>
      <Layout>
        <Header style={layoutStyles.header}>
          <span>mingchuan.me</span>
          <span>
            <Icon type="poweroff" />
          </span>
        </Header>
        <ContentContainer>
          <Sider>
            <AdminMenu currentRoute={routeKey} routeMap={menuConfig.routes}></AdminMenu>
          </Sider>
          <InnerContent>{props.children}</InnerContent>
        </ContentContainer>
        <Footer style={layoutStyles.footer}>
          <span>
            credit by <a href="https://mingchuan.me">DemoHn</a> - {currentYear}
          </span>
        </Footer>
      </Layout>
    </Container>
  )
}

export default AdminLayout
