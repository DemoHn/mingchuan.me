import { wrapRoute, AppRequest } from './_routes'
import { getPublicPost, getPublicPostsList } from '../transformers/publicPost'
import { getPublicPostByID, listPublicPosts } from '../services/publicPostService'

const getPublicPostSchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
      id: {
        type: 'string',
      },
    },
  },
}

async function getPublicPostFunc(req: AppRequest) {
  const { id } = req.params
  const post = await getPublicPostByID(parseInt(id))

  return getPublicPost(post)
}

///// list recent published posts
async function listPublicPostsFunc(req: AppRequest) {
  const { limit, cursor } = req.query
  const Qlimit = limit ? parseInt(limit as string, 10) : undefined
  const Qcursor = cursor ? parseInt(cursor as string, 10) : undefined
  const [posts, hasMore, newCursor] = await listPublicPosts(Qlimit, Qcursor)

  return getPublicPostsList(posts, hasMore, newCursor)
}

export default {
  getPublicPost: wrapRoute(getPublicPostFunc, getPublicPostSchema),
  listPublicPosts: wrapRoute(listPublicPostsFunc, {}),
}
