import React from 'react'
import { Dropdown, Menu, Icon, Modal } from 'antd'

//// styles

//// props
export enum OperationAction {
  setPublic = 'setPublic',
  setPrivate = 'setPrivate',
  publishDraft = 'publishDraft',
  deletePost = 'deletePost',
  recoverPost = 'recoverPost',
  edit = 'edit',
}

//// texts
const $texts = {
  operationText: '操作',
  // actions
  [OperationAction.setPublic]: {
    text: '设为公开',
    modalText: '确定将 「$1」设为公开？ 设置之后，此文章将会出现在文章列表中。',
  },
  [OperationAction.setPrivate]: {
    text: '设为仅自己可见',
    modalText: '确定将 「$1」设为仅自己可见？ 设置之后，此文章将从文章列表隐藏。',
  },
  [OperationAction.publishDraft]: {
    text: '发布草稿',
    modalText: '确定将 「$1」发布？',
  },
  [OperationAction.deletePost]: {
    text: '删除文章',
    modalText: '确定删除 「$1」？ 此文章将会移动到回收站。',
  },
  [OperationAction.recoverPost]: {
    text: '恢复文章',
    modalText: '确定将 「$1」从回收站中恢复？',
  },
  [OperationAction.edit]: {
    text: '编辑文章',
  },
}

export interface OperationProps {
  actions: OperationAction[]
  postTitle: string
  onAction: (action: OperationAction) => any
}

const Operation: React.FC<OperationProps> = props => {
  const { actions, onAction, postTitle } = props
  const { confirm } = Modal
  //// actions
  const handleClick = (action: OperationAction) => {
    const actionText = $texts[action] as any
    if (actionText.modalText) {
      handleConfirm(action)
    } else {
      // trigger action directly
      onAction(action)
    }
  }

  const handleConfirm = (action: OperationAction) => {
    const actionText = $texts[action] as any
    const modalText = actionText.modalText.replace('$1', postTitle)
    confirm({
      title: modalText,
      onOk() {
        onAction(action)
      },
    })
  }
  const menu = () => {
    return (
      <Menu onClick={({ key }) => handleClick(key as OperationAction)}>
        {actions.map((actionItem: OperationAction) => {
          const textItem = $texts[actionItem]
          return (
            <Menu.Item key={actionItem}>
              <a href="javascript:void(0)">{textItem.text}</a>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }

  return (
    <Dropdown overlay={menu}>
      <a href="javascript:void(0)">
        {$texts.operationText} <Icon type="down" />
      </a>
    </Dropdown>
  )
}

export default Operation
