export class AppError extends Error {
  statusCode!: number
  name!: string
  message!: string
  data?: {}

  public constructor(statusCode: number, name: string, message: string, data?: {}) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.message = message
    this.data = data
  }
}

export default {
  newValidationError(validationObject: string, data?: {}): AppError {
    return new AppError(
      400,
      'ValidationError',
      `validate '${validationObject}' failed`,
      data
    )
  },
  newLogicError(name: string, error: Error | string): AppError {
    return new AppError(400, name, error instanceof Error ? error.message : error)
  },
  newAuthError(error: Error | string): AppError {
    return new AppError(401, 'AuthError', error instanceof Error ? error.message : error)
  },
}
