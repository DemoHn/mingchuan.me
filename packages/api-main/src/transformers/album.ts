import AlbumDirectory from '../models/AlbumDirectory'
import AlbumFile from 'models/AlbumFile'

export function getAlbumDir(dir: AlbumDirectory) {
  return {
    id: dir.id,
    parentNode: dir.parentNode,
    name: dir.name
  }
}

export function getAlbumFile(file: AlbumFile) {
  return {
    id: file.id,
    directoryId: file.directoryId,
    name: file.name,
    key: file.hashKey,
    size: file.size
  }
}