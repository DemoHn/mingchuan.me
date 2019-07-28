import { jsonRequest, JSONResponse } from './_base'
import { SubmitPayload } from 'components/PostEditor'
import { Request } from 'express'

export async function adminCreatePost(body: SubmitPayload): Promise<JSONResponse> {
  const payload = {
    body: {
      title: body.title,
      type: body.type,
      content: body.content,
      status: body.publishOptions.draft ? 'DRAFTED' : 'PUBLISHED',
      permission: body.publishOptions.public ? 'PUBLIC' : 'PRIVATE',
    },
  }
  return jsonRequest('POST', '/api/admin/posts', payload)
}

export interface PostResponse {
  id: number
  title: string
  content?: string
  type: string
  status: string
  permission: string
  createTime: number
  lastUpdateTime: number
}

export async function adminListPosts(
  limit?: number,
  page?: number,
  serverReq?: Request
): Promise<JSONResponse> {
  const payload = {
    query: {
      limit,
      page,
    },
  }

  return jsonRequest('GET', '/api/admin/posts', payload, serverReq)
}

export async function adminGetOnePost(
  id: number,
  serverReq?: Request
): Promise<JSONResponse> {
  return jsonRequest('GET', `/api/admin/posts/${id}`, {}, serverReq)
}

export async function adminUpdatePostContent(
  id: number,
  updateContent: {
    title?: string
    content?: string
  },
  serverReq?: Request
): Promise<JSONResponse> {
  return jsonRequest(
    'PATCH',
    `/api/admin/posts/${id}`,
    {
      body: updateContent,
    },
    serverReq
  )
}

export async function adminUpdatePostStatus(
  id: number,
  status: string,
  serverReq?: Request
): Promise<JSONResponse> {
  return jsonRequest(
    'PATCH',
    `/api/admin/posts/status/${id}`,
    {
      body: { status },
    },
    serverReq
  )
}

export async function adminUpdatePostPermission(
  id: number,
  permission: string,
  serverReq?: Request
): Promise<JSONResponse> {
  return jsonRequest(
    'PATCH',
    `/api/admin/posts/permission/${id}`,
    {
      body: { permission },
    },
    serverReq
  )
}

export async function getPublicPost(
  id: number,
  serverReq?: Request
): Promise<JSONResponse> {
  return jsonRequest('GET', `/api/posts/${id}`, {}, serverReq)
}

export async function getPublicPostsList(
  cursorOptions?: {
    cursor?: number
    limit?: number
  },
  serverReq?: Request
): Promise<JSONResponse> {
  return jsonRequest(
    'GET',
    `/api/posts`,
    {
      query: cursorOptions
        ? {
            cursor: cursorOptions.cursor,
            limit: cursorOptions.limit,
          }
        : {},
    },
    serverReq
  )
}
