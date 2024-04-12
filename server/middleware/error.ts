import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { handler } from "../lib/errorHandler";
import { AppError } from "../lib/appError";

export const handleError: ErrorRequestHandler = async (err: AppError, req: Request, res: Response, next: NextFunction) => {
  handler.handleError(err, res)
}
