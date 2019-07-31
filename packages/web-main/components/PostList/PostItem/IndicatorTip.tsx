import React from 'react'
import styled from 'styled-components'
import { Icon, Tooltip } from 'antd'

//// texts
const $texts = {
  statusPublished: '已发布',
  statusDraft: '草稿',
  statusRemoved: '已删除',
  permPublic: '公开',
  permPrivate: '仅自己可见',
}
//// styles
const Wrapper = styled.span`
  margin-left: 2px;
  margin-right: 2px;
  font-size: 15px;
`
//// props
export interface IndicatorTipProps {
  showType: 'status' | 'permission'
  value: string // depends on showType
}

const IndicatorTip: React.FC<IndicatorTipProps> = props => {
  const { showType, value } = props

  switch (showType) {
    case 'status':
      switch (value) {
        case 'PUBLISHED':
          return (
            <Wrapper>
              <Tooltip title={$texts.statusPublished}>
                <Icon type="check-circle" style={{ color: '#237804' }} />
              </Tooltip>
            </Wrapper>
          )
        case 'DRAFTED':
          return (
            <Wrapper>
              <Tooltip title={$texts.statusDraft}>
                <Icon type="container" style={{ color: '#b3b3b3' }} />
              </Tooltip>
            </Wrapper>
          )
        case 'REMOVED':
          return (
            <Wrapper>
              <Tooltip title={$texts.statusRemoved}>
                <Icon type="delete" style={{ color: '#b3b3b3' }} />
              </Tooltip>
            </Wrapper>
          )
        default:
          return null
      }
    case 'permission':
      switch (value) {
        case 'PUBLIC':
          return (
            <Wrapper>
              <Tooltip title={$texts.permPublic}>
                <Icon type="unlock" style={{ color: '#237804' }} />
              </Tooltip>
            </Wrapper>
          )
        case 'PRIVATE':
          return (
            <Wrapper>
              <Tooltip title={$texts.permPrivate}>
                <Icon type="lock" style={{ color: '#b3b3b3' }} />
              </Tooltip>
            </Wrapper>
          )
        default:
          return null
      }
    default:
      return null
  }
}

export default IndicatorTip
