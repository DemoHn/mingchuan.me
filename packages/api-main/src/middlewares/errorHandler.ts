import { AppError } from '../utils/errors'

export default function(error: any, _: any, res: any, __: any) {
  if (error instanceof AppError) {
    const e = error
    res.status(e.statusCode).json({
      data: e.data,
      message: e.message,
      name: e.name,
    })
  } else {
    // unknown error
    res.status(500).json({
      message: error.message,
      name: 'UnknownError',
    })
  }
}
