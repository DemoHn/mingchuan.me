import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  width: 100%;
  display: flex;
  font-size: 20px;
  line-height: 1.6;
  max-width: 480px;
`

const Lead = styled.div`
  flex: 0 0 auto;
  font-weight: 100;
`

const TitleBar = styled.div`
  flex: 1 1 auto;
  padding: 0 10px;
  cursor: pointer;
  font-family: monospace, sans-serif;
  color: #1890ff;
  transition: color 300ms;

  &:hover {
    color: #096dd9;
    text-decoration: underline;
  }
`

const DateBar = styled.div`
  flex: 0 0 auto;
  font-size: 18px;
  color: #aaa;
`

const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`)
const formatDate = (date: Date) => {
  const YYYY = date.getFullYear()
  const MM = padZero(date.getMonth() + 1)
  const DD = padZero(date.getDate())

  return `${YYYY}-${MM}-${DD}`
}

//// props
export interface PostTitleProps {
  title: string
  postLink: string
  createTime: number
}
const PostTitle: React.FC<PostTitleProps> = props => {
  const { title, postLink, createTime } = props
  return (
    <Container>
      <Lead>Δ</Lead>
      <TitleBar>
        <Link href={postLink}>
          <span>{title}</span>
        </Link>
      </TitleBar>
      <DateBar>{formatDate(new Date(createTime))}</DateBar>
    </Container>
  )
}

export default PostTitle
