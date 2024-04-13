import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { validateRequest } from "../../utils/validateRequest";
import { registerUser, updateUser } from "../../service/user/user.service";

export const registerUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await registerUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      roleId: req.body.roleId,
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};
export const UpdateUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await updateUser({
      id: req.body.id,
      firstName: req.body.dataToUpdate.firstName,
      lastName: req.body.dataToUpdate.lastName,
      email: req.body.dataToUpdate.email,
      password: req.body.dataToUpdate.password,
      phone: req.body.dataToUpdate.phone,
      roleId: req.body.dataToUpdate.roleId,
    });

    return res.status(201).json({
      message: "User Updated successfully",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};
