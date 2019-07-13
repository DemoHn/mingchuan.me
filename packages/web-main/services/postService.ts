import { jsonRequest, JSONResponse } from './_base'
import { SubmitPayload } from 'components/PostEditor'

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
