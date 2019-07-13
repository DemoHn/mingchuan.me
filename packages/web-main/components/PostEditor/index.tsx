import React, { useState } from 'react'
import styled from 'styled-components'
//// components
import Title from './Title'
import Content from './Content'
import Footer from './Footer'

//// styles
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

//// props
interface SubmitPayload {
  title: string
  content: string
  type: string
  publishOptions: Record<string, any>
}

export interface PostEditorProps {
  type: 'html' | 'markdown'
  onSubmit: (payload: SubmitPayload) => any
  // RESERVED
  // onCancel: () => any
  limits: {
    maxTitleLength?: number
  }
}

const PostEditor: React.FC<PostEditorProps> = () => {
  const [title, setTitle] = useState('')
  return (
    <Container>
      <Title type="html" title={title} onChange={setTitle} maxTitleLength={10}></Title>
      <Content type="html" />
      <Footer onSave={() => {}} />
    </Container>
  )
}

export default PostEditor
