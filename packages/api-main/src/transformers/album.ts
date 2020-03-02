import AlbumDirectory from '../models/AlbumDirectory'

export function getAlbumDir(dir: AlbumDirectory) {
  return {
    id: dir.id,
    parentNode: dir.parentNode,
    name: dir.name
  }
}