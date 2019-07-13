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
  margin-left: 8px;
`
//// texts
const $texts = {
  save: '发布',
  saveAsDraft: '保存为草稿',
  savePublic: '公开发表',
  saveUpdates: '保存修改',
}
//// props
export interface SaveOption {
  draft: boolean
  public: boolean
}
export interface FooterProps {
  onSave: (opt: SaveOption) => any
  editMode: boolean
  initialOption?: SaveOption
}

const Footer: React.FC<FooterProps> = props => {
  const { onSave, initialOption, editMode } = props
  const [draft, setDraft] = useState(initialOption ? initialOption.draft : false)
  const [isPublic, setPublic] = useState(initialOption ? initialOption.public : true)

  const handleSave = () => {
    onSave({
      draft,
      public: isPublic,
    })
  }
  return (
    <FooterBar>
      <SwitchBar>
        <span>
          <Switch
            size="small"
            defaultChecked={draft}
            onChange={(opt: boolean) => setDraft(opt)}
          />
          <FooterSwitchLabel>{$texts.saveAsDraft}</FooterSwitchLabel>
        </span>
        <span>
          <Switch
            defaultChecked={isPublic}
            onChange={(opt: boolean) => setPublic(opt)}
            size="small"
          />
          <FooterSwitchLabel>{$texts.savePublic}</FooterSwitchLabel>
        </span>
      </SwitchBar>
      <Button type="primary" onClick={handleSave}>
        {editMode ? $texts.saveUpdates : $texts.save}
      </Button>
    </FooterBar>
  )
}

export default Footer
