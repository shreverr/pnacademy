import { Request } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../lib/appError";
import commonErrorsDictionary from "./error/commonErrors";

export const validateRequest = (req: Request) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
    throw new AppError(commonErrorsDictionary.badRequest.name, commonErrorsDictionary.badRequest.httpCode, result.array().toString(), true)
  }
}
