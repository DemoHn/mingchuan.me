import React from 'react'
import styled from 'styled-components'
import { Dropdown, Button, Icon } from 'antd'
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const TitleBar = styled.div`
  display: flex;
  border-bottom: 1px solid #dcdcdc;
  align-items: center;
  width: 100%;
  height: 54px;
  padding-left: 20px;
`

const TitleInput = styled.input`
  font-size: 24px;
  line-height: 1;
  width: 100%;
  display: block;
  outline: none;
  border: none;

  &::placeholder {
    opacity: 0.6;
  }
`

const TypeBar = styled.div`
  flex-shrink: 1;
  border-left: 1px dashed #dedede;
  padding-left: 20px;
  padding-right: 20px;
`
const PostEditor: React.FC = () => {
  return (
    <Container>
      <TitleBar>
        <TitleInput placeholder="在此输入标题..." />
        <TypeBar>
          <Dropdown overlay={<div>2</div>}>
            <Button>
              Button <Icon type="down" />
            </Button>
          </Dropdown>
        </TypeBar>
      </TitleBar>
    </Container>
  )
}

export default PostEditor
