import React from 'react'
import styled from 'styled-components'
import QuillEditor from './html'

const Container = styled.div`
  flex: 1 1 auto;
`

export interface ContentProps {
  type: string
  content: string
  onChange: (content: string) => any
}
const Content: React.FC<ContentProps> = props => {
  const { content, onChange } = props
  return (
    <Container>
      <QuillEditor text={content} onChange={onChange} />
    </Container>
  )
}

export default Content
