import { NextFunction, Request, RequestHandler, Response } from "express";
import { validateRequest } from "../../utils/validateRequest";
import { registerUser } from "../../service/user/user.service";

export const registerUserController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateRequest(req);
    const userData = await registerUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      roleId: req.body.roleId,
    })

    return res.status(201).json({
      message: "User registered successfully",
      data: userData
    });
  } catch (error) {
    next(error)
  }
}
