import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';
import commonErrorsDictionary from "../utils/error/commonErrors";
import { Permissions } from "../types/user.types";
import logger from "../config/logger";

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateUser = (permissions: Permissions[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    logger.debug(`Token: ${token}`)

    if (!token) {
      return res.status(commonErrorsDictionary.unauthorized.httpCode)
        .json({ error: commonErrorsDictionary.unauthorized.name })
    }

    jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
      if (err) {
        logger.error(`Error verifying token: ${err}`)
        return res.status(commonErrorsDictionary.forbidden.httpCode)
          .json({ error: commonErrorsDictionary.forbidden.name })
      }
      
      //checks if all the permissions in the array are present in the user's permissions
      if ( process.env.ENVIRONMENT === 'prod' && (!permissions.every(permission => user.permissions.includes(permission)))) {
        return res.status(commonErrorsDictionary.unauthorized.httpCode)
          .json({
            error: commonErrorsDictionary.unauthorized.name,
            message: "Insufficient permissions"
          })
      }

      req.user = user
      next()
    })
  }
}
