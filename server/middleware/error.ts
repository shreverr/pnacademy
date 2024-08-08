import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { handler } from "../lib/errorHandler";
import { AppError } from "../lib/appError";

export const handleError: ErrorRequestHandler = async (err: AppError, req: Request, res: Response, next: NextFunction) => {
  handler.handleError(err, res)
}

export const jsonParseError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    throw new AppError('Invalid JSON payload passed.', 400, 'JSON syntax error', true)
    next(err)
  }
  next();
}