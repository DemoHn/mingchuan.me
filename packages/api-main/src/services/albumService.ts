import AlbumDirectory, { AlbumDirectoryPayload } from '../models/AlbumDirectory'
import AlbumFile, { AlbumFilePayload } from '../models/AlbumFile'
import Errors from '../utils/errors'
import config from '../config/default'
import { unlinkSync } from 'fs'

/**
 * AlbumService - manage files & directories via a pesudo-tree structure.
 */
class AlbumService {

  static MIME_IMAGE = 1;
  static MIME_PDF = 2;
  static MIME_OTHERS = 10;
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
      mimeType: this.findMimeHandler(mimeType),
      size: size,
      name: name
    }
    // validate directoryId if directoryId isn't 0
    if (dir != 0) {
      const res = await AlbumFile.findOne({
        where: { directoryId: dir }
      })
      if (!res) {
        throw Errors.newLogicError('EmptyDirError', `no such directoryId: ${dir}`)
      }
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

  async listFiles(page: number, count: number, directoryId?: number): Promise<[number, Array<AlbumFile>]> {
    const offset = (page - 1) * count
    const query: any = {
      limit: count,
      offset: offset,
      where: {}
    }
    if (directoryId != null) {
      query.where.directoryId = directoryId
    }

    const results = await AlbumFile.findAndCountAll(query)
    return [results.count, results.rows]
  }

  async getFileInfoByKey(key: string): Promise<AlbumFile> {
    const result = await AlbumFile.findOne({
      where: {
        hashKey: key
      }
    })

    if (!result) {
      throw Errors.newNotFoundError('FileNotFoundError', `file ${key} not found!`)
    }
    return result
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

  findMimeHandler(mimeType: string): number {
    if (mimeType.startsWith('images')) {
      return AlbumService.MIME_IMAGE
    } else {
      return AlbumService.MIME_OTHERS
    }
  }
}

export default AlbumService