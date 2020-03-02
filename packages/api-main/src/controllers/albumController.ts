import { wrapRoute, AppRequest } from './_routes'
import AlbumService from '../services/albumService'
import { getAlbumDir } from '../transformers/album'

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

export default {
  createDirectory: wrapRoute(createDirFunc, createDirSchema)
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