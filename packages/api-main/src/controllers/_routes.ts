import { Request, Response, NextFunction } from 'express'
import Ajv from 'ajv'
import Errors from '../utils/errors'

// define types of Request & Response for app
export interface AppRequest extends Request {
  authPayload?: object
  authToken?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppResponse extends Response {}

export interface RequestSchema {
  body?: {}
  query?: {}
  params?: {}
}

const ajv = new Ajv()
export const wrapRoute = (
  routeFunc: (req: AppRequest, res: AppResponse) => Promise<any>,
  schema: RequestSchema
) => (req: AppRequest, res: AppResponse, next: NextFunction) => {
  // validate data
  const schTuples = [
    [schema.body, req.body],
    [schema.query, req.query],
    [schema.params, req.params],
  ]

  for (var [sch, data] of schTuples) {
    if (sch) {
      const validate = ajv.compile(sch) as any
      if (!validate(data)) {
        const path = `${req.method} ${req.path}`
        return next(Errors.newValidationError(path, validate.errors))
      }
    }
  }

  return routeFunc(req, res)
    .then(data => res.status(200).json(data))
    .catch(err => next(err))
}
