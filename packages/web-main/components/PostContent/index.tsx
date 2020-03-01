import React from 'react'
import parse from 'html-react-parser'
import 'highlight.js/styles/atom-one-light.css'
import './styles.scss'

export interface PostContentProps {
  content: string
  contentType: 'html' | 'markdown'
}

const PostContent: React.FC<PostContentProps> = props => {
  const { content } = props
  // TODO: handle `contentType`
  return <div className="mce-content">{parse(content)}</div>
}

export default PostContent
