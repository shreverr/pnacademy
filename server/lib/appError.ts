import type { HttpCode } from '../types/error.types'

export class AppError extends Error {
  public readonly name: string
  public readonly httpCode: HttpCode
  public readonly isOperational: boolean
  public readonly description: string

  constructor (name: string, httpCode: HttpCode, description: string, isOperational: boolean) {
    super(name)

    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

    this.description = description
    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}
