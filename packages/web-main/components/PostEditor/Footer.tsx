import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Switch } from 'antd'

//// styles
const FooterBar = styled.div`
  display: flex;
  border-top: 1px solid #e3e3e3;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  justify-content: flex-end;
`

const SwitchBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 20px;
`

const FooterSwitchLabel = styled.span`
  font-size: 13px;
  color: #777;
`
//// texts
const $texts = {
  save: '发布',
  saveAsDraft: '保存为草稿',
  savePublic: '公开发表',
}
//// props
interface SaveOption {
  draft: boolean
  public: boolean
}
export interface FooterProps {
  onSave: (opt: SaveOption) => any
}

const Footer: React.FC<FooterProps> = props => {
  const [draft, setDraft] = useState(false)
  const [isPublic, setPublic] = useState(true)
  const { onSave } = props
  return (
    <FooterBar>
      <SwitchBar>
        <span>
          <Switch size="small" defaultChecked={draft} onChange={setDraft} />{' '}
          <FooterSwitchLabel>{$texts.saveAsDraft}</FooterSwitchLabel>
        </span>
        <span>
          <Switch defaultChecked={isPublic} onChange={setPublic} size="small" />{' '}
          <FooterSwitchLabel>{$texts.savePublic}</FooterSwitchLabel>
        </span>
      </SwitchBar>
      <Button
        type="primary"
        onClick={() =>
          onSave({
            draft,
            public: isPublic,
          })
        }
      >
        {$texts.save}
      </Button>
    </FooterBar>
  )
}

export default Footer
