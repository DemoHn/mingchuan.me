import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
  width: 100%;
  display: flex;
  font-size: 18px;
`

const Lead = styled.div`
  flex: 0 0 auto;
  padding: 0 10px;
`

const TitleBar = styled.div`
  flex: 1 1 auto;
  padding: 0 10px;
`

const DateBar = styled.div`
  flex: 0 0 auto;
  color: #999;
`

const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`)
const formatDate = (date: Date) => {
  const YYYY = date.getFullYear()
  const MM = padZero(date.getMonth() + 1)
  const DD = padZero(date.getDate())
  const HH = padZero(date.getHours())
  const mm = padZero(date.getMinutes())

  return `${YYYY}-${MM}-${DD} ${HH}:${mm}`
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
