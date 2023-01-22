import HTTP_STATUS from 'http-status-codes'
export interface IErrorResponse {
  message: string
  statusCode: number
  status: string
  serializeErrors: () => IError
}
export interface IError {
  message: string
  statusCode: number
  status: string
}
export abstract class CustomeErrors extends Error {
  abstract statusCode: number
  abstract status: string
  constructor (message: string) {
    super(message)
  }

  serializeErrors (): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    }
  }
}
export class joiRequistValidationError extends CustomeErrors {
  statusCode = HTTP_STATUS.BAD_REQUEST
  status = 'error'
  constructor (message: string) {
    super(message)
  }
}
export class BadRequistError extends CustomeErrors {
  statusCode = HTTP_STATUS.BAD_REQUEST
  status = 'error'
  constructor (message: string) {
    super(message)
  }
}
export class NotFoundError extends CustomeErrors {
  statusCode = HTTP_STATUS.NOT_FOUND
  status = 'error'
  constructor (message: string) {
    super(message)
  }
}
export class NotAuthorizesError extends CustomeErrors {
  statusCode = HTTP_STATUS.UNAUTHORIZED
  status = 'error'
  constructor (message: string) {
    super(message)
  }
}
export class FileToLargeError extends CustomeErrors {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG
  status = 'error'
  constructor (message: string) {
    super(message)
  }
}
