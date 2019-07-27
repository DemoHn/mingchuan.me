import { AppRequest, AppResponse } from '../controllers/_routes'
import { NextFunction } from 'connect'
import { verifyLoginJwt } from '../services/accountService'
import Errors from '../utils/errors'

export default async function(req: AppRequest, _: AppResponse, next: NextFunction) {
  const authHeader = req.get('authorization')
  const re = /Bearer (.+)$/

  if (!authHeader || !re.exec(authHeader)) {
    return next(Errors.newAuthError('invalid or malformed auth header'))
  }

  const [, jwt] = re.exec(authHeader) as RegExpExecArray
  const payload = await verifyLoginJwt(jwt)
  // add payload & raw jwt
  req.authPayload = payload
  req.authToken = jwt
  return next()
}
