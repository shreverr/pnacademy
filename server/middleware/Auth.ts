import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';
import commonErrorsDictionary from "../utils/error/commonErrors";
import { Permissions } from "../types/user.types";
import logger from "../config/logger";

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string,
        roleId: string,
        permissions: Permissions[]
      }
    }
  }
}

export const authenticateUser = (permissions?: Permissions[], requireAny: boolean = false) => {
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

      if (permissions) {
        const hasPermissions = requireAny
          ? permissions.some(permission => user.permissions.includes(permission))  // OR logic
          : permissions.every(permission => user.permissions.includes(permission)); // AND logic (default)

        if (!hasPermissions) {
          return res.status(commonErrorsDictionary.unauthorized.httpCode)
            .json({
              error: commonErrorsDictionary.unauthorized.name,
              message: "Insufficient permissions"
            })
        }
      }

      req.user = user
      next()
    })
  }
}