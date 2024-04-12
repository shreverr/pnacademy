import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../../lib/appError";
import commonErrorsDictionary from "../../utils/error/commonErrors";
import { validateRequest } from "../../utils/validateRequest";

export const registerUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRequest(req);
    // throw new AppError(commonErrorsDictionary.badRequest.name, commonErrorsDictionary.badRequest.httpCode, "User registration failed", true);
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    next(error)
  }
}
