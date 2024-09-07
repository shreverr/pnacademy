import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import commonErrorsDictionary from "../utils/error/commonErrors";
import { AppError } from "../lib/appError";

const INTERNAL_AUTH_TOKEN = process.env.INTERNAL_AUTH_TOKEN

if (!INTERNAL_AUTH_TOKEN) {
  throw new AppError(
    "Internal auth token is not defined",
    commonErrorsDictionary.internalServerError.httpCode,
    "Token is not defined",
    false
  )
}

export const authenticateInternalService = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]

  logger.debug(`Token: ${token}`)

  if (!token) {
    return res.status(commonErrorsDictionary.unauthorized.httpCode)
      .json({ error: commonErrorsDictionary.unauthorized.name })
  }

  if (token === process.env.INTERNAL_AUTH_TOKEN) {
    next()
  } else {
    return res.status(commonErrorsDictionary.unauthorized.httpCode)
      .json({ error: commonErrorsDictionary.unauthorized.name })
  }
}
