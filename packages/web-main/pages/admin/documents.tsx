import React from 'react'
import { NextFunctionComponent, NextContext } from 'next'
import AdminLayout from './_layout'
import styled from 'styled-components'
import { Container } from 'next/app'
import { Pagination, Upload, Button, Icon } from 'antd'
import { getToken } from 'services/_base'
import { Request } from 'express'
import { adminListFiles, FileItem } from 'services/albumService'

const PaginationContainer = styled.div`
  display: flex;
  flex: 0 0 auto;
  height: 60px;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
`
export interface DocumentsPageProps {
  token: string
  files: FileItem[]
  totalCount: number
}
const DocumentsPage: NextFunctionComponent<DocumentsPageProps> = props => {
  const uploadProps = {
    name: 'uploadFile',
    action: '/api/admin/album/upload',
    data: {
      directoryId: 0
    },
    headers: {
      'Auth-Schema': 'ADMIN',
      'Authorization': `Bearer ${props.token}`
    }
  }
  return (
    <AdminLayout routeKey="documents">
      <Container>
        <div>
          {JSON.stringify(props.files)}
        </div>

        <Upload {...uploadProps}>
          <Button>
            <Icon type="upload" /> 上传文件
          </Button>
        </Upload>
        <PaginationContainer>
          <Pagination
            defaultCurrent={1}
            total={100}
            pageSize={20}
            onChange={() => { }}
          />
        </PaginationContainer>
      </Container>
    </AdminLayout>
  )
}

DocumentsPage.getInitialProps = async (ctx: NextContext) => {
  const req = ctx.req as Request

  const fileList = await adminListFiles(0, 10, 1, req)
  /// handle
  if (fileList.isSuccess) {
    const { page, list } = fileList.body as any
    return {
      token: getToken(req),
      files: list,
      totalCount: page.count
    }
  }

  return {
    token: getToken(req),
    files: [],
    totalCount: 0
  }
}
export default DocumentsPage