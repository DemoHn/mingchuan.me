import React, { ReactNodeArray, ReactNode } from 'react'
import { Menu, Icon } from 'antd'

//// example routeMap
/**
 *  [{
      name: '文章',
      icon: 'calendar',
      key: 'posts', // --> route = /admin/posts
      children: [
        {
          name: '文章列表',
          icon: 'file-text',
          key: 'list', // --> route = /admin/posts/list
        },
        {
          name: '创建文章',
          icon: 'file-add',
          key: 'new', // --> route = /admin/posts/new
        },
      ],
    }],
 * */
const { SubMenu } = Menu

export interface AdminMenuProps {
  currentRoute: string
  routeMap: Record<string, any>[]
  onClick: (route: string) => any
}

const composeMenuMap = (
  rootKey: string,
  menuMap: Record<string, any>[]
): ReactNodeArray => {
  const composeSubMenu = (
    key: string,
    title: string,
    children: ReactNodeArray,
    icon?: string | ReactNode
  ) => {
    const submenuIcon = icon ? (
      typeof icon === 'string' ? (
        <Icon type={icon} />
      ) : (
        icon
      )
    ) : null
    return (
      <SubMenu
        key={key}
        title={
          <span>
            {submenuIcon}
            <span>{title}</span>
          </span>
        }
      >
        {children}
      </SubMenu>
    )
  }

  const composeMenuItem = (key: string, title: string, icon?: string | ReactNode) => {
    const submenuIcon = icon ? (
      typeof icon === 'string' ? (
        <Icon type={icon} />
      ) : (
        icon
      )
    ) : null

    return (
      <Menu.Item key={key}>
        <span>
          {submenuIcon}
          <span>{title}</span>
        </span>
      </Menu.Item>
    )
  }
  return menuMap.map(item => {
    const actualKey = rootKey === '' ? item.key : `${rootKey}/${item.key}`
    return item.children
      ? composeSubMenu(
          actualKey,
          item.name,
          composeMenuMap(actualKey, item.children),
          item.icon
        )
      : composeMenuItem(actualKey, item.name, item.icon)
  })
}

const AdminMenu: React.FC<AdminMenuProps> = props => {
  const { routeMap, onClick, currentRoute } = props
  // get open keys
  const routesArr = currentRoute.split('/')
  const defaultKeys: string[] = []
  routesArr.reduce((accu: string, cursor: string) => {
    const newItem = accu === '' ? cursor : accu + cursor
    defaultKeys.push(newItem)
    return newItem
  }, '')

  return (
    <Menu
      mode="inline"
      onClick={({ key }) => {
        onClick(key)
      }}
      defaultOpenKeys={defaultKeys}
      defaultSelectedKeys={[currentRoute]}
    >
      {composeMenuMap('', routeMap)}
    </Menu>
  )
}

export default AdminMenu
