import AlbumDirectory, { AlbumDirectoryPayload } from '../models/AlbumDirectory'
//import AlbumFile, { AlbumFilePayload } from 'models/AlbumFile'
import Errors from '../utils/errors'


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
  /**
  async uploadFile(name: string, dirNode: number, file: File): Promise<AlbumFile> {

  }
  */
}

export default AlbumService