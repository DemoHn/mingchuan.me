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

const layoutStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
  },
  content: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '30px',
    padding: '30px 0',
    backgroundColor: '#fff',
    minHeight: '600px',
    maxWidth: '1200px',
  },
  sider: {
    backgroundColor: '#fff',
    borderRight: '1px solid #ddd',
  },
  innerContent: {
    padding: '0 24px',
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
  const { Header, Content, Footer, Sider } = Layout
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
        <Content>
          <Layout style={layoutStyles.content}>
            <Sider width={240} style={layoutStyles.sider}>
              <AdminMenu
                onClick={(route: string) => {
                  console.log(route)
                }}
                currentRoute={routeKey}
                routeMap={menuConfig.routes}
              ></AdminMenu>
            </Sider>
            <Content style={layoutStyles.innerContent}>{props.children}</Content>
          </Layout>
        </Content>
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
