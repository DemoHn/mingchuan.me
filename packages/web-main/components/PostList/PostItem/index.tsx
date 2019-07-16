import React from 'react'
import styled from 'styled-components'
//// components
import IndicatorTip from './IndicatorTip'
import TimeDisplay from './TimeDisplay'
import Operation, { OperationAction } from './Operation'
import { PostResponse } from 'services/postService'
//// styles
const Container = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  margin: 10px 30px;
`

const IndicatorBar = styled.div`
  flex: 0 0 auto;
`

const TitleBar = styled.div`
  flex: 0 0 auto;
  padding-left: 15px;
  padding-right: 25px;
  font-size: 19px;

  transition: color 250ms;
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
`

const OpeartionBar = styled.div`
  flex: 1 1 auto;
`

const EditTimeBar = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`
//// handlers
const calculateOperations = (status: string, permission: string): OperationAction[] => {
  const ops: OperationAction[] = []
  // status
  switch (status) {
    case 'REMOVED':
      ops.push(OperationAction.recoverPost)
      break
    case 'PUBLISHED':
      ops.push(OperationAction.edit)
      ops.push(OperationAction.deletePost)
      break
    case 'DRAFTED':
      ops.push(OperationAction.edit)
      ops.push(OperationAction.publishDraft)
      break
    default:
      break
  }
  // permission
  switch (permission) {
    case 'PRIVATE':
      ops.push(OperationAction.setPublic)
      break
    case 'PUBLIC':
      ops.push(OperationAction.setPrivate)
      break
    default:
      break
  }
  return ops
}
//// props
export interface PostItemProps {
  post: PostResponse
  onOperationAction: (action: OperationAction) => any
}

const PostItem: React.FC<PostItemProps> = props => {
  const { post, onOperationAction } = props
  const { title, status, permission, createTime, lastUpdateTime } = post
  const currentDate = new Date()

  return (
    <Container>
      <IndicatorBar>
        <IndicatorTip showType="status" value={status} />
        <IndicatorTip showType="permission" value={permission} />
      </IndicatorBar>
      <TitleBar onClick={() => onOperationAction(OperationAction.edit)}>{title}</TitleBar>
      <OpeartionBar>
        <Operation
          actions={calculateOperations(status, permission)}
          onAction={onOperationAction}
          postTitle={title}
        />
      </OpeartionBar>
      <EditTimeBar>
        <TimeDisplay
          timestamp={lastUpdateTime}
          currentDate={currentDate}
          displayType="edit"
        />
        <TimeDisplay
          timestamp={createTime}
          currentDate={currentDate}
          displayType="create"
        />
      </EditTimeBar>
    </Container>
  )
}

export default PostItem
