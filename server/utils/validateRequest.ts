import { type NextFunction, type Request, type Response } from 'express'
import { validationResult } from 'express-validator'
import { AppError } from '../lib/appError'
import commonErrorsDictionary from './error/commonErrors'
import logger from '../config/logger'

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    // throw new AppError(commonErrorsDictionary.badRequest.name, commonErrorsDictionary.badRequest.httpCode, result.array().toString(), true)
    logger.error({
      name: commonErrorsDictionary.badRequest.name,
      code: commonErrorsDictionary.badRequest.httpCode,
      message: result.array()
    })
    return res.status(400).json({
      status: 'error',
      message: result.array()
    })
  }
  next()
}
