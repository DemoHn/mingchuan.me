import { wrapRoute, AppRequest, AppResponse } from './_routes'
import AlbumService from '../services/albumService'
import { getAlbumDir, getAlbumFile } from '../transformers/album'
import fs from 'fs'
import Errors from '../utils/errors'
import config from '../config/default'
import { NextFunction } from 'express'

const albumService = new AlbumService();

// create directory
const createDirSchema = {
  body: {
    required: ['name'],
    properties: {
      name: { type: 'string' },
      parentNode: { type: 'number' },
      isRoot: { type: 'boolean' }
    }
  }
}
async function createDirFunc(req: AppRequest) {
  const { name, parentNode, isRoot } = req.body
  const dir = await albumService.createDirectory(name, isRoot, parentNode)
  return getAlbumDir(dir)
}

const uploadFileSchema = {
  body: {
    required: ['directoryId'],
    properties: {
      directoryId: {
        type: 'string',
        pattern: '[0-9]+'
      }
    }
  }
}

async function uploadFileFunc(req: AppRequest) {
  const file = req.file
  const { directoryId } = req.body

  const fileInfo = await albumService.uploadFile(
    file['filename'],
    file['size'],
    file['originalname'],
    directoryId,
    file['mimetype']
  )
  return getAlbumFile(fileInfo)
}

// listFiles
const listFilesSchema = {
  params: {
    type: 'object',
    properties: {
      page: {
        type: 'string',
        pattern: '[0-9]+'
      },
      count: {
        type: 'string',
        pattern: '[0-9]+'
      },
      directoryId: {
        type: 'string',
        pattern: '[0-9]+'
      }
    }
  }
}

async function listFilesFunc(req: AppRequest) {
  const { page, count, directoryId } = req.query
  const pageF = parseInt(page) || 1
  const countF = parseInt(count) || 20
  const directoryID = parseInt(directoryId) || null
  const [countT, results] = await albumService.listFiles(
    pageF,
    countF,
    directoryID
  )

  return {
    page: {
      page: pageF,
      count: countF,
      totalCount: countT
    },
    list: results.map(getAlbumFile)
  }
}

export default {
  createDirectory: wrapRoute(createDirFunc, createDirSchema),
  uploadFile: wrapRoute(uploadFileFunc, uploadFileSchema),
  listFiles: wrapRoute(listFilesFunc, listFilesSchema),
  getResource: async (req: AppRequest, res: AppResponse, next: NextFunction) => {
    // find key first
    const { key } = req.params
    try {
      const result = await albumService.getFileInfoByKey(key)
      // read file
      const filePath = `${config.album.rootDir}/${key}`
      const rs = fs.createReadStream(filePath)

      if (result.mimeType == AlbumService.MIME_IMAGE) {
        //res.set('Content-Type', 'images/jpeg')
      }
      rs.pipe(res)
      rs.on('error', (err) => {
        return next(Errors.newNotFoundError('FileNotFound', `file ${key} not found in resource`))
      })
    } catch (error) {
      return next(error)
    }
  }
}

/**
class AlbumController {
  public albumS: AlbumService

  constructor() {
    // TODO: use dependency-injection helpers!
    this.albumS = new AlbumService()
  }

  createDirectory(req: AppRequest) {
    //// add schema
    const inputSchema = {
      body: {
        required: ['name'],
        properties: {
          name: { type: 'string' },
          parentNode: { type: 'number' },
          isRoot: { type: 'boolean' }
        }
      }
    }
    //// add executor
    const createDirectoryFunc = async (req: AppRequest) => {
      const { name, parentNode, isRoot } = req.body
      const dir = await this.albumS.createDirectory(name, isRoot, parentNode)
      return getAlbumDir(dir)
    }

    return wrapRoute(createDirectoryFunc, inputSchema)
  }
}

export default AlbumController
*/