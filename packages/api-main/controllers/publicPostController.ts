import { wrapRoute, AppRequest } from './_routes'
import { getPublicPost } from '../transformers/publicPost'
import { getPublicPostByID } from '../services/publicPostService'

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
  const post = await getPublicPostByID(id)

  return getPublicPost(post)
}

export default {
  getPublicPost: wrapRoute(getPublicPostFunc, getPublicPostSchema),
}
