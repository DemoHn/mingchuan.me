export interface AppError {
  statusCode: number
  name: string
  message: string
  data?: {}
  $type: 'AppError'
}

export default {
  newValidationError(validationObject: string, data?: {}): AppError {
    return {
      statusCode: 400,
      name: 'ValidationError',
      message: `validate '${validationObject}' failed`,
      data,
      $type: 'AppError',
    }
  },
}
