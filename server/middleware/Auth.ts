import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from 'jsonwebtoken';
import commonErrorsDictionary from "../utils/error/commonErrors";

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(commonErrorsDictionary.unauthorized.httpCode)
      .json({ error: commonErrorsDictionary.unauthorized.name })
  }

  jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(commonErrorsDictionary.forbidden.httpCode)
        .json({ error: commonErrorsDictionary.forbidden.name })
    }
    req.user = user
    next()
  })
};
