import React, { useState, useEffect, useCallback } from 'react'
import { NextFunctionComponent, NextContext } from 'next'
import styled from 'styled-components'
import { Pagination } from 'antd'
import Link from 'next/link'

//// components
import PostList from 'components/PostList'
import AdminLayout from '../_layout'

//// services
import { adminListPosts, PostResponse } from 'services/postService'
import { Request } from 'express'

//// assets
import loaderSVG from 'assets/loader.svg'

//// styles
const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`

const PostListContainer = styled.div`
  flex: 1 1 auto;
`

const PaginationContainer = styled.div`
  display: flex;
  flex: 0 0 auto;
  height: 60px;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
`

//// props
export interface ListPostPageProps {
  totalCount: number
  page: number
  posts: PostResponse[]
}

const PAGE_LIMIT = 10

const ListPostPage: NextFunctionComponent<ListPostPageProps> = props => {
  const { page, posts, totalCount } = props
  //// states
  const [displayPosts, setDisplayPosts] = useState(posts)
  const [loading, setLoading] = useState(false)
  const [displayPage, setDisplayPage] = useState(page)
  const [displayTotal, setDisplayTotal] = useState(totalCount)
  // handlers

  const handlePageChange = useCallback(async (page: number) => {
    setDisplayPage(page)

    //// start loading data
    setLoading(true)

    const pageList = await adminListPosts(PAGE_LIMIT, page)
    if (pageList.isSuccess) {
      const { totalCount, posts } = pageList.body as any
      setDisplayPosts(posts)
      setDisplayTotal(totalCount)
    } else {
      //// TODO: handle
    }
    setLoading(false)
  }, [])
  return (
    <AdminLayout routeKey="posts/list">
      <Container>
        <PostListContainer>
          {loading ? (
            <LoaderContainer>
              <img src={loaderSVG} height={16} />
            </LoaderContainer>
          ) : (
            <PostList posts={displayPosts} />
          )}
        </PostListContainer>
        <PaginationContainer>
          <Pagination
            defaultCurrent={displayPage}
            total={displayTotal}
            onChange={handlePageChange}
          />
        </PaginationContainer>
      </Container>
    </AdminLayout>
  )
}

ListPostPage.getInitialProps = async (ctx: NextContext) => {
  const req = ctx.req as Request

  const page = req && req.query.page ? parseInt(req.query.page, 10) : 1
  const postList = await adminListPosts(PAGE_LIMIT, page, req)
  /// handle
  if (postList.isSuccess) {
    const { posts, totalCount } = postList.body as any

    return {
      posts,
      totalCount,
      page,
    }

    // if postList failed on `getInitialProps`, then handle it
    // on client side rendering.
  }

  return {
    posts: [],
    totalCount: 0,
    page: 1,
  }
}

export default ListPostPage
