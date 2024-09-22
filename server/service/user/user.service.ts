import {
  createRoleInDB,
  createUser,
  deleteRolesById,
  getAllRoles,
  getAllUsers,
  getPasswordById,
  getRoleById,
  getUserByEmail,
  getUserById,
  createBulkUsers,
  updateOrSaveRefreshToken,
  updateUserInDb,
  deleteUsersById,
  addUsersToGroupById,
  removeUsersFromGroupById,
  getAllUsersByGroupId,
  updateRoleInDB,
  getAllUsersByRoleId,
} from "../../model/user/user.model";
import {
  RoleData,
  UserData,
  authTokens,
  device,
  roleAttributes,
  userAttributes,
} from "../../types/user.types";
import { v4 as uuid } from "uuid";
import { AppError } from "../../lib/appError";
import { hashPassword } from "../../utils/password";
import commonErrorsDictionary from "../../utils/error/commonErrors";
import bcrypt from "bcryptjs";
import jwt, { Jwt } from "jsonwebtoken";
import { UUID } from "crypto";
import logger from "../../config/logger";
import { csvToObjectArray, objectArrayToCSV } from "../../utils/csvParser";
import { deleteFileFromDisk } from "../../lib/file";

export const viewUserDetails = async (
  userId: string
): Promise<UserData | null> => {
  const existingUserData = await getUserById(userId);
  if (!existingUserData)
    throw new AppError(
      "User does not exist",
      409,
      "User with this user id does not exist",
      false
    );

  return existingUserData;
};

export const viewAllUsers = async (
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: userAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  users: UserData[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "first_name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: allUsersData, count: allUsersCount } = await getAllUsers(
    offset,
    pageSize,
    sortBy,
    order
  );

  if (!allUsersData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  const totalPages = Math.ceil(allUsersCount / pageSize);

  return {
    users: allUsersData,
    totalPages: totalPages,
  };
};

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
  deviceType: device;
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
    userRole?.canManageReports ? "canManageReports" : "",
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

  if (
    !(await updateOrSaveRefreshToken(
      { userId: existingUser.id, refreshToken },
      user.deviceType
    ))
  )
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

export const newAccessToken = async (refreshToken: string): Promise<string> => {
  let userId: string = "";
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) {
        logger.error(`Error verifying accesss token: ${err}`);
        throw new AppError(
          "Token not valid",
          commonErrorsDictionary.forbidden.httpCode,
          "Token not valid",
          false
        );
      }

      userId = user.userId;
    }
  );

  const existingUser = await getUserById(userId);
  if (!existingUser)
    throw new AppError("User not found", 401, "User not found", false);

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

  const grantedPermissions = [
    userRole?.canManageAssessment ? "canManageAssessment" : "",
    userRole?.canManageUser ? "canManageUser" : "",
    userRole?.canManageRole ? "canManageRole" : "",
    userRole?.canManageNotification ? "canManageNotification" : "",
    userRole?.canManageLocalGroup ? "canManageLocalGroup" : "",
    userRole?.canManageReports ? "canManageReports" : "",
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

  return accessToken;
};

export const createRole = async (role: {
  name: string;
  canManageAssessment: boolean;
  canManageUser: boolean;
  canManageRole: boolean;
  canManageNotification: boolean;
  canManageLocalGroup: boolean;
  canManageReports: boolean;
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
    canManageReports: role.canManageReports,
    canAttemptAssessment: role.canAttemptAssessment,
    canViewReport: role.canViewReport,
    canManageMyAccount: role.canManageMyAccount,
    canViewNotification: role.canViewNotification,
  });

  return roleData;
};

export const updateRole = async (role: {
  roleId: string;
  name: string | null;
  canManageAssessment: boolean | null;
  canManageUser: boolean | null;
  canManageRole: boolean | null;
  canManageNotification: boolean | null;
  canManageLocalGroup: boolean | null;
  canManageReports: boolean | null;
  canAttemptAssessment: boolean | null;
  canViewReport: boolean | null;
  canManageMyAccount: boolean | null;
  canViewNotification: boolean | null;
}): Promise<RoleData | null> => {
  const existingRole = await getRoleById(role.roleId);
  if (!existingRole)
    throw new AppError(
      "Role not found",
      404,
      "Role with this id does not exist",
      false
    );

  const updatedRole = await updateRoleInDB({
    id: role.roleId,
    name: role.name,
    canManageAssessment: role.canManageAssessment,
    canManageUser: role.canManageUser,
    canManageRole: role.canManageRole,
    canManageNotification: role.canManageNotification,
    canManageLocalGroup: role.canManageLocalGroup,
    canManageReports: role.canManageReports,
    canAttemptAssessment: role.canAttemptAssessment,
    canViewReport: role.canViewReport,
    canManageMyAccount: role.canManageMyAccount,
    canViewNotification: role.canViewNotification,
  });

  return updatedRole;
};

export const deleteRole = async (
  roleIds: { roleId: string }[]
): Promise<boolean> => {
  const roleDatatoDelete = roleIds.map((roleId) => roleId.roleId);
  const roleDeletionResult = await deleteRolesById(roleDatatoDelete);
  if (!roleDeletionResult)
    throw new AppError(
      "Role not found",
      404,
      "Role with this id does not exist",
      false
    );

  return true;
};

export const viewAllRoles = async (
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: roleAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  roles: RoleData[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: allRolesData, count: allRolesCount } = await getAllRoles(
    offset,
    pageSize,
    sortBy,
    order
  );

  if (!allRolesData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  const totalPages = Math.ceil(allRolesCount / pageSize);

  return {
    roles: allRolesData,
    totalPages: totalPages,
  };
};

export const importUsers = async (
  filePath: string,
  updateExisting: boolean = false
): Promise<boolean> => {
  const parsedData = await csvToObjectArray<UserData>(filePath);
  logger.debug(parsedData);

  parsedData.forEach((user) => {
    if (!user.id) user.id = uuid();
  });

  const result = createBulkUsers(parsedData, updateExisting);
  deleteFileFromDisk(filePath);

  return result;
};

export const exportUsers = async (): Promise<string> => {
  const result = await getAllUsers();
  const convetedCSVPath = objectArrayToCSV<UserData>(result.rows);

  return convetedCSVPath;
};

export const deleteUsers = async (userIds: string[]): Promise<boolean> => {
  const result = await deleteUsersById(userIds);
  return result;
};

export const addUsersToGroup = async (
  userIds: string[],
  groupId: string
): Promise<boolean> => {
  const data = userIds.map((userId) => ({
    user_id: userId,
    group_id: groupId,
  }));

  const result = await addUsersToGroupById(data);

  return result;
};

export const removeUsersFromGroup = async (
  userIds: string[],
  groupId: string
): Promise<boolean> => {
  const data = userIds.map((userId) => ({
    user_id: userId,
    group_id: groupId,
  }));

  const result = await removeUsersFromGroupById(data);

  return result;
};

export const getUsersInGroup = async (
  groupId: string,
  pageStr?: string,
  pageSizeStr?: string,
  sortBy?: userAttributes,
  order?: "ASC" | "DESC"
): Promise<{
  users: UserData[];
  totalPages: number;
}> => {
  const page = parseInt(pageStr ?? "1");
  const pageSize = parseInt(pageSizeStr ?? "10");
  sortBy = sortBy ?? "first_name";
  order = order ?? "ASC";

  const offset = (page - 1) * pageSize;

  const { rows: allUsersData, count: allUsersCount } =
    await getAllUsersByGroupId(groupId, offset, pageSize, sortBy, order);

  if (!allUsersData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      "Someting went wrong",
      false
    );
  }

  const totalPages = Math.ceil(allUsersCount / pageSize);

  return {
    users: allUsersData,
    totalPages: totalPages,
  };
};

export const getUsersbyroleId = async (
  roleId: string
): Promise<UserData[] | null> => {
 const users = await getAllUsersByRoleId(roleId);
  return users;
}