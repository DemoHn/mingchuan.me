import { Request, Response, NextFunction } from 'express'
import Ajv from 'ajv'
type RouteP = (req: Request, res: Response) => Promise<any>

const ajv = new Ajv()

export interface RequestSchema {
  body?: {}
  query?: {}
  params?: {}
}

export const wrapRoute = (routeFunc: RouteP, schema: RequestSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validate data
  const schTuples = [
    [schema.body, req.body],
    [schema.query, req.query],
    [schema.params, req.params],
  ]

  for (var [sch, data] of schTuples) {
    if (sch) {
      const validate = ajv.compile(sch) as any
      const valid = validate(data)

      if (!valid) {
        return next(new Error(validate.errors))
      }
    }
  }

  return routeFunc(req, res)
    .then(data => res.status(200).json(data))
    .catch(err => next(err))
}
