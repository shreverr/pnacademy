import {
  createRoleInDB,
  createUser,
  deleteRolesById,
  getPasswordById,
  getRoleById,
  getUserByEmail,
  getUserById,
  saveRefreshToken,
  updateUserInDb,
} from "../../model/user/user.model";
import { RoleData, UserData, authTokens } from "../../types/user.types";
import { v4 as uuid } from "uuid";
import { AppError } from "../../lib/appError";
import { hashPassword } from "../../utils/password";
import commonErrorsDictionary from "../../utils/error/commonErrors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UUID } from "crypto";

export const registerUser = async (user: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string | null;
  roleId: string | null;
}): Promise<UserData | null> => {
  const userExists = await getUserByEmail(user.email);
  if (userExists)
    throw new AppError(
      "User already exists",
      409,
      "User with this email already exists",
      false
    );

  const userData = await createUser({
    id: uuid(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: await hashPassword(user.password),
    phone: user.phone,
    roleId: user.roleId,
  });

  if (!userData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  return userData;
};

export const updateUser = async (ToBeUpdatedUser: {
  id: UUID;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  roleId: string | null;
}): Promise<UserData | null> => {
  const existingUser = await getUserById(ToBeUpdatedUser.id);
  if (!existingUser) {
    throw new AppError(
      "User not found",
      404,
      "User with this id does not exist",
      false
    );
  }
  const UpdatedUser = await updateUserInDb({
    id: ToBeUpdatedUser.id,
    firstName: ToBeUpdatedUser.firstName,
    lastName: ToBeUpdatedUser.lastName,
    email: ToBeUpdatedUser.email,
    phone: ToBeUpdatedUser.phone,
    roleId: ToBeUpdatedUser.roleId,
  });

  if (UpdatedUser === null) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Something went wrong while updating user",
      false
    );
  }
  return UpdatedUser;
};

export const loginUser = async (user: {
  email: string;
  password: string;
}): Promise<authTokens> => {
  const existingUser = await getUserByEmail(user.email);
  if (!existingUser)
    throw new AppError(
      "Invalid credentials",
      401,
      "Invalid credentials",
      false
    );

  const correctPassword =
    (await getPasswordById(existingUser.id))?.password ?? "";

  if (!(await bcrypt.compare(user.password, correctPassword)))
    throw new AppError(
      "Invalid credentials",
      401,
      "Invalid credentials",
      false
    );

  if (!existingUser.role_id)
    throw new AppError("Role not assigned", 401, "Role not assigned", false);

  const userRole = await getRoleById(existingUser.role_id);
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret)
    throw new AppError(
      "Internal server error",
      500,
      "Access token secret not found",
      false
    );

  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!refreshTokenSecret)
    throw new AppError(
      "Internal server error",
      500,
      "Refresh token secret not found",
      false
    );

  const grantedPermissions = [
    userRole?.canManageAssessment ? "canManageAssessment" : "",
    userRole?.canManageUser ? "canManageUser" : "",
    userRole?.canManageRole ? "canManageRole" : "",
    userRole?.canManageNotification ? "canManageNotification" : "",
    userRole?.canManageLocalGroup ? "canManageLocalGroup" : "",
    userRole?.canAttemptAssessment ? "canAttemptAssessment" : "",
    userRole?.canViewReport ? "canViewReport" : "",
    userRole?.canManageMyAccount ? "canManageMyAccount" : "",
    userRole?.canViewNotification ? "canViewNotification" : "",
  ].filter((permission) => permission !== "");

  const accessToken = jwt.sign(
    {
      userId: existingUser.id,
      roleId: existingUser.role_id,
      permissions: grantedPermissions,
    },
    accessTokenSecret,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: existingUser.id,
    },
    refreshTokenSecret,
    {
      expiresIn: "7d",
    }
  );

  if (!(await saveRefreshToken({ userId: existingUser.id, refreshToken })))
    throw new AppError(
      "Internal server error",
      500,
      "Error saving refresh token",
      false
    );

  return {
    accessToken,
    refreshToken,
  };
};

export const createRole = async (role: {
  name: string;
  canManageAssessment: boolean;
  canManageUser: boolean;
  canManageRole: boolean;
  canManageNotification: boolean;
  canManageLocalGroup: boolean;
  canAttemptAssessment: boolean;
  canViewReport: boolean;
  canManageMyAccount: boolean;
  canViewNotification: boolean;
}): Promise<RoleData | null> => {
  const roleData = await createRoleInDB({
    id: uuid(),
    name: role.name,
    canManageAssessment: role.canManageAssessment,
    canManageUser: role.canManageUser,
    canManageRole: role.canManageRole,
    canManageNotification: role.canManageNotification,
    canManageLocalGroup: role.canManageLocalGroup,
    canAttemptAssessment: role.canAttemptAssessment,
    canViewReport: role.canViewReport,
    canManageMyAccount: role.canManageMyAccount,
    canViewNotification: role.canViewNotification,
  });

  return roleData;
};

export const deleteRole = async (
  roleIds: { roleId: string }[]
): Promise<boolean> => {
  const roleIdsExist = roleIds.map(async (roleId) => {
    const role = await getRoleById(roleId.roleId);
    if (!role)
      throw new AppError(
        "Role not found",
        404,
        "Role with this id does not exist",
        false
      );
  });
 
  const roleDatatoDelete= roleIds.map((roleId)=>roleId.roleId); 
  const roleData= await deleteRolesById(roleDatatoDelete);
  if (!roleData)
    throw new AppError(
      "Role not found",
      404,
      "Role with this id does not exist",
      false
    );
    

  return true;
};
