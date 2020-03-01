import React from 'react'
import styled from 'styled-components'
import { Icon, Tooltip } from 'antd'
import { displayTimestamp } from 'utils/formatDate'

//// styles
const TimeRow = styled.div`
  color: #aaa;
  text-align: left;
  width: 100%;
  font-size: 13px;
`

const TextDisplay = styled.span`
  margin-left: 5px;
`
//// texts
const $texts = {
  editFrom: '编辑于',
  createFrom: '创建于',
}
//// props
export interface TimeDisplayProps {
  displayType: 'edit' | 'create'
  timestamp: number
  currentDate?: Date
}

const TimeDisplay: React.FC<TimeDisplayProps> = props => {
  const { timestamp, displayType } = props
  const currentDate = props.currentDate.getTime() || Date.now()

  return (
    <TimeRow>
      <Tooltip title={displayType === 'edit' ? $texts.editFrom : $texts.createFrom}>
        <Icon type={displayType === 'edit' ? 'edit' : 'file'} />
        <TextDisplay>{displayTimestamp(timestamp, currentDate)}</TextDisplay>
      </Tooltip>
    </TimeRow>
  )
}

export default TimeDisplay
