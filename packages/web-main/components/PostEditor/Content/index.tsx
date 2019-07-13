import React from 'react'
import styled from 'styled-components'
import QuillEditor from './html'

const Container = styled.div`
  flex: 1 1 auto;
`

export interface ContentProps {
  type: string
}
const Content: React.FC<ContentProps> = () => {
  return (
    <Container>
      <QuillEditor />
    </Container>
  )
}

export default Content
