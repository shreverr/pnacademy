import type { Response } from 'express'
import logger from '../config/logger'
import type { AppError } from './appError'

class ErrorHandler {
  public async handleError (error: AppError, responseStream: Response): Promise<Response> {
    logger.error(error)
    return responseStream.status(error.httpCode ?? 500).json({
      status: 'error',
      message: error.message
    })
  }
}

export const handler = new ErrorHandler()
