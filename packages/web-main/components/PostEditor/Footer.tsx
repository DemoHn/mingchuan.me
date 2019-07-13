import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

//// styles
const FooterBar = styled.div`
  display: flex;
  border-top: 1px solid #e3e3e3;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 20px;
`
//// texts
const $texts = {
  save: '保存',
}
//// props
export interface FooterProps {
  onSave: () => any
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <FooterBar>
      <Button type="primary">{$texts.save}</Button>
    </FooterBar>
  )
}

export default Footer
