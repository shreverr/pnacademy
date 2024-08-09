import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import {
  addUsersToGroup,
  createRole,
  deleteRole,
  deleteUsers,
  exportUsers,
  getUsersInGroup,
  importUsers,
  loginUser,
  newAccessToken,
  registerUser,
  removeUsersFromGroup,
  updateRole,
  updateUser,
  viewAllRoles,
  viewAllUsers,
  viewUserDetails,
} from "../../service/user/user.service";
import { roleAttributes, userAttributes } from "../../types/user.types";
import { deleteFileFromDisk } from "../../lib/file";

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

export const viewUserDetailsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await viewUserDetails(req.user.userId);

    return res.status(201).json({
      message: "success",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const viewAllUsersController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = await viewAllUsers(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as userAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(201).json({
      message: "success",
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
      deviceType: req.body.deviceType,
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

export const updateRoleController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRole = await updateRole({
      id: req.body.id,
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
      message: "Role Updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    next(error);
  }
};

export const newAccessTokenController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = await newAccessToken(req.body.refreshToken);

    return res.status(200).json({
      message: "New Access Token granted successfully",
      accessToken: accessToken,
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

export const viewAllRolesController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rolesData = await viewAllRoles(
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as roleAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(201).json({
      message: "success",
      data: rolesData,
    });
  } catch (error) {
    next(error);
  }
};

export const importUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const importResult = await importUsers(
      req.file!.path,
      req.body.updateExisting
    );

    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const exportUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exportedFilePath = await exportUsers();

    return res.status(200).sendFile(exportedFilePath, (err) => {
      if (err) {
        next(err);
      } else {
        deleteFileFromDisk(exportedFilePath);
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsersDeleted = await deleteUsers(req.body.userIds);

    return res.status(200).json({
      message: allUsersDeleted
        ? "Users Deleted successfully"
        : "Some users deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const UserAddToGroupController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await addUsersToGroup(req.body.userIds, req.body.groupId);

    return res.status(200).json({
      status: "success",
      message: "Users Added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const removeUsersFromGroupController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await removeUsersFromGroup(req.body.userIds, req.body.groupId);

    return res.status(200).json({
      status: "success",
      message: "Users removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersByGroupController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsersInGroup(
      req.query.groupId as string,
      req.query.page as string,
      req.query.pageSize as string,
      req.query.sortBy as userAttributes,
      req.query.order as "ASC" | "DESC"
    );

    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
