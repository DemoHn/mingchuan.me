import AlbumDirectory, { AlbumDirectoryPayload } from '../models/AlbumDirectory'
import AlbumFile, { AlbumFilePayload } from '../models/AlbumFile'
import Errors from '../utils/errors'
import config from '../config/default'
import { unlinkSync } from 'fs'

/**
 * AlbumService - manage files & directories via a pesudo-tree structure.
 */
class AlbumService {
  /**
   * createDirectory - create new directory node.
   * @param name directory name. notice dirname should be unique within the same parentNode.
   * @param isRoot if directory name should be created under root directory (parentNode = 0)
   * @param parentNode specific parentNode. should be used when isRoot = false
   */
  async createDirectory(name: string, isRoot?: boolean, parentNode?: number): Promise<AlbumDirectory> {
    // directory info payload
    const payload: AlbumDirectoryPayload = {
      parentNode: isRoot ? 0 : parentNode,
      name: name
    }

    return AlbumDirectory.create(payload)
      .catch(err => {
        if (err.name && err.name == 'SequelizeUniqueConstraintError') { // unique key error
          throw Errors.newLogicError('UniqueNameError', `directory name should be unique`)
        } else {
          throw err
        }
      })
  }

  async uploadFile(key: string, size: number, name: string, dir: number, mimeType: string): Promise<AlbumFile> {
    const payload: AlbumFilePayload = {
      directoryId: dir,
      hashKey: key,
      mimeType: 0,
      size: size,
      name: name
    }
    // validate directoryId
    const res = await AlbumFile.findOne({
      where: { directoryId: dir }
    })
    if (!res) {
      throw Errors.newLogicError('EmptyDirError', `no such directoryId: ${dir}`)
    }

    return AlbumFile.create(payload)
      .catch(err => {
        // delete file
        this.unlinkFile(key, false)
        if (err.name && err.name == 'SequelizeUniqueConstraintError') { // unique key error
          throw Errors.newLogicError('UniqueNameError', `upload file name should be unique`)
        } else {
          throw err
        }
      })
  }

  async unlinkFile(file: string, throwError: boolean) {
    const p = `${config.album.rootDir}/${file}`
    try {
      unlinkSync(p)
    } catch (e) {
      if (throwError) {
        throw e
      } else {
        console.log('--unlinkFile--')
        console.log(e)
      }
    }
  }
}

export default AlbumService