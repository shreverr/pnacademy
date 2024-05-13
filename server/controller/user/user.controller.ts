import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import {
  createRole,
  deleteRole,
  loginUser,
  registerUser,
  updateUser,
} from "../../service/user/user.service";

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

export const loginUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokens = await loginUser({
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const createRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdRole = await createRole({
      name: req.body.name,
      canManageAssessment: req.body.permissions.canManageAssessment,
      canManageUser: req.body.permissions.canManageUser,
      canManageRole: req.body.permissions.canManageRole,
      canManageNotification: req.body.permissions.canManageNotification,
      canManageLocalGroup: req.body.permissions.canManageLocalGroup,
      canManageReports: req.body.permissions.canManageReports,
      canAttemptAssessment: req.body.permissions.canAttemptAssessment,
      canViewReport: req.body.permissions.canViewReport,
      canManageMyAccount: req.body.permissions.canManageMyAccount,
      canViewNotification: req.body.permissions.canViewNotification,
    });

    return res.status(201).json({
      message: "Role Created successfully",
      data: createdRole,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedRole = await deleteRole(req.body.roleIds);

    return res.status(200).json({
      message: "Roles Deleted successfully",
      data: deletedRole,
    });
  } catch (error) {
    next(error);
  }
};
