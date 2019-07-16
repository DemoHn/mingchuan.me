import React from 'react'
import styled from 'styled-components'
import { Icon, Tooltip } from 'antd'

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
//// formatters
const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`)
const formatDate = (date: Date, type?: string) => {
  const YYYY = date.getFullYear()
  const MM = padZero(date.getMonth() + 1)
  const DD = padZero(date.getDate())
  const HH = padZero(date.getHours())
  const mm = padZero(date.getMinutes())

  switch (type) {
    case 'HHmm':
      return `${HH}:${mm}`
    case 'MMDDHHmm':
      return `${MM}-${DD} ${HH}:${mm}`
    default:
      return `${YYYY}-${MM}-${DD} ${HH}:${mm}`
  }
}

const TimeDisplay: React.FC<TimeDisplayProps> = props => {
  const { timestamp, displayType } = props
  const currentDate = props.currentDate || new Date()
  const showDate = new Date(timestamp)

  var displayTime = ''
  if (showDate.getFullYear() === currentDate.getFullYear()) {
    if (
      showDate.getMonth() === currentDate.getMonth() &&
      showDate.getDate() === currentDate.getDate()
    ) {
      displayTime = formatDate(showDate, 'HHmm')
    } else {
      displayTime = formatDate(showDate, 'MMDDHHmm')
    }
  } else {
    //// YYYY-MM-DD mm:ss
    displayTime = formatDate(showDate)
  }
  return (
    <TimeRow>
      <Tooltip title={displayType === 'edit' ? $texts.editFrom : $texts.createFrom}>
        <Icon type={displayType === 'edit' ? 'edit' : 'file'} />
        <TextDisplay>{displayTime}</TextDisplay>
      </Tooltip>
    </TimeRow>
  )
}

export default TimeDisplay
