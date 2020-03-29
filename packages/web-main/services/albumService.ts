import { JSONResponse, jsonRequest } from "./_base";

export async function adminListFiles(
  directoryId?: number,
  limit?: number,
  page?: number,
  serverReq?: Request
): Promise<JSONResponse> {
  const payload = {
    query: {
      count: limit,
      page,
      directoryId
    }
  }

  return jsonRequest('GET', '/api/admin/album/files', payload, serverReq)
}

export interface FileItem {
  id: number
  directoryId: number
  name: string
  key: string
  size: number
}