import {
  createRoleInDB,
  createUser,
  getPasswordById,
  getUserByEmail,
  getUserById,
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

// export const loginUser = async (user: {
//   id: string;
//   password: string;
// }): Promise<authTokens> => {
//   const userExists = await getUserById(user.id)
//   const correctPassword = (await getPasswordById(user.id))?.password ?? ''

//   if (!userExists || ! await bcrypt.compare(user.password, correctPassword))
//     throw new AppError(
//       "Invalid credentials",
//       401,
//       "Invalid credentials",
//       false
//     );

//   const token = jwt.sign({ userId: user.id, userId: user.username, roles: user.roles, permissions: user.permissions }, secretKey);

//   return userData;
// }

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
