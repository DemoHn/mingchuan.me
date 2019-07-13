import React, { useState } from 'react'
import styled from 'styled-components'
//// components
import Title from './Title'
import Content from './Content'
import Footer, { SaveOption } from './Footer'

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
  editMode: boolean
  initialValue?: {
    title: string
    content: string
    publishOptions: {
      public: boolean
      draft: boolean
    }
  }
  limits?: {
    maxTitleLength?: number
  }
}

const PostEditor: React.FC<PostEditorProps> = props => {
  // props
  const { type, onSubmit, limits, editMode, initialValue } = props
  const titleLimit = limits && limits.maxTitleLength ? limits.maxTitleLength : undefined
  // states
  const [title, setTitle] = useState(initialValue ? initialValue.title : '')
  const [content, setContent] = useState(initialValue ? initialValue.content : '')

  // handlers
  const handleSave = (options: SaveOption) => {
    const payload = {
      title,
      content,
      type,
      publishOptions: options,
    }

    onSubmit(payload)
  }

  return (
    <Container>
      <Title
        type={type}
        title={title}
        onChange={setTitle}
        maxTitleLength={titleLimit}
      ></Title>
      <Content type={type} content={content} onChange={setContent} />
      <Footer
        onSave={handleSave}
        editMode={editMode}
        initialOption={initialValue ? initialValue.publishOptions : undefined}
      />
    </Container>
  )
}

export default PostEditor
