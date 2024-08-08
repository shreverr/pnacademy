import { FindAndCountOptions, ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import { sequelize } from "../../config/database";
import logger from "../../config/logger";
import { AppError } from "../../lib/appError";
import Password from "../../schema/user/password.schema";
import RefreshToken from "../../schema/user/refreshToken.schema";
import Role from "../../schema/user/role.schema";
import User from "../../schema/user/user.schema";
import {
  device,
  roleAttributes,
  userAttributes,
  type RoleData,
  type UserData,
} from "../../types/user.types";
import UserGroup from "../../schema/junction/userGroup.schema";

export const getUserByEmail = async (
  email: string
): Promise<UserData | null> => {
  try {
    const user = User.findOne({
      where: {
        email,
      },
      raw: true,
    });

    return await user;
  } catch (error) {
    throw new AppError(
      "error getting user by email",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const user = User.findOne({
      where: {
        id,
      },
      raw: true,
    });
    return await user;
  } catch (error) {
    throw new AppError(
      "error getting user by id",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getAllUsers = async (
  offset?: number,
  pageSize?: number,
  sortBy?: userAttributes,
  order?: "ASC" | "DESC",
): Promise<{
  rows: UserData[],
  count: number
}> => {
  try {
    const findOptions: FindAndCountOptions = (offset !== null || offset !== undefined) && pageSize && sortBy && order ? {
      limit: pageSize,
      offset: offset,
      order: [[sortBy, order]]
    } : {}

    const allUsersData = await User.findAndCountAll(findOptions);

    // Convert the data to plain object
    let plainData: {
      rows: UserData[]
      count: number
    } = {
      rows: allUsersData.rows.map((user) => user.get({ plain: true })),
      count: allUsersData.count
    }

    return plainData;
  } catch (error) {
    throw new AppError(
      "error getting all users",
      500,
      "Something went wrong",
      true
    );
  }
};

export const getAllRoles = async (
  offset: number,
  pageSize: number,
  sortBy: roleAttributes,
  order: "ASC" | "DESC",
): Promise<{
  rows: RoleData[],
  count: number
}> => {
  try {
    const allRolesData = Role.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [[sortBy, order]]
    });

    return await allRolesData;
  } catch (error) {
    throw new AppError(
      "error getting all roles",
      500,
      "Something went wrong",
      true
    );
  }
};

export const createUser = async (userData: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string | null;
  roleId: string | null;
}): Promise<UserData | null> => {
  logger.info(`Creating user with email: ${userData.email}`);
  const transaction = await sequelize.transaction();
  try {
    const user = await User.create(
      {
        id: userData.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role_id: userData.roleId,
      },
      { transaction, raw: true }
    );

    await Password.create(
      {
        user_id: userData.id,
        password: userData.password,
      },
      { transaction, raw: true }
    );

    await transaction.commit();
    return user;
  } catch (error) {
    // Rollback transaction if there's an error
    await transaction.rollback();
    throw new AppError(
      "error creating user",
      500,
      "Something went wrong",
      false
    );
  }
};

export const updateUserInDb = async (userData: {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  roleId: string | null;
}): Promise<UserData | null> => {
  logger.info(`Updating user with id ${userData.id}`);

  try {
    const updateData: any = {
      first_name: userData.firstName ?? undefined,
      last_name: userData.lastName ?? undefined,
      email: userData.email ?? undefined,
      phone: userData.phone ?? undefined,
      role_id: userData.roleId ?? undefined,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    if (Object.keys(updateData).length === 0) {
      return null;
    }

    const [_, [updatedUser]] = await User.update(updateData, {
      where: {
        id: userData.id,
      },
      returning: true,
    });

    return updatedUser.dataValues as UserData;
  } catch (error) {
    throw new AppError(
      "error updating user",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getPasswordById = async (id: string): Promise<Password | null> => {
  try {
    const password = await Password.findOne({
      where: {
        user_id: id,
      },
      raw: true,
    });

    return password;
  } catch (error) {
    throw new AppError(
      "error getting password by id",
      500,
      "Something went wrong",
      false
    );
  }
};

export const createRoleInDB = async (
  role: RoleData
): Promise<RoleData | null> => {
  logger.info(`Creating role: ${role.name}`);
  try {
    const createdRole = await Role.create(
      {
        id: role.id,
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
      },
      {
        raw: true,
      }
    );
    return createdRole;
  } catch (error) {
    throw new AppError(
      "error creating role",
      500,
      "Something went wrong",
      false
    );
  }
};

export const getRoleById = async (id: string): Promise<RoleData | null> => {
  logger.info(`Fetching role by id: ${id}`);
  try {
    const role = await Role.findOne({
      where: {
        id,
      },
    });
    return role;
  } catch (error) {
    throw new AppError(
      "error finding role",
      500,
      "Something went wrong",
      false
    );
  }
};

// Update the refresh token if exists otherwise create one
export const updateOrSaveRefreshToken = async (token: {
  userId: string;
  refreshToken: string;
},
  deviceType: device
): Promise<boolean> => {
  logger.info(`Saving refresh token for ${token.userId}`);
  try {
    const refreshToken = await RefreshToken.upsert(
      {
        user_id: token.userId,
        device_type: deviceType,
        refresh_token: token.refreshToken,
      },
    );
    return true;
  } catch (error: any) {
    throw new AppError("error saving refresh token", 500, error, true);
  }
};

export const deleteRolesById = async (roleIds: string[]): Promise<boolean> => {
  logger.info(`Deleting roles with id: ${roleIds}`);
  try {
    const result = await Role.destroy({
      where: {
        id: roleIds,
      },
    })

    if (result === 0) {
      return false;
    };

  } catch (error: any) {
    throw new AppError(
      "error deleting role",
      500,
      error,
      false
    );
  }
  return true;
};

export const createBulkUsers = async (
  userData: UserData[],
  updateExisting: boolean = false
): Promise<boolean> => {
  logger.info(`creating bulk users`);
  try {
    logger.debug(userData)
    await User.bulkCreate(userData, updateExisting ? {
      updateOnDuplicate: ["first_name", "last_name", "email", "phone", "role_id"],
    } : {
      ignoreDuplicates: true,
    });

    return true;
  } catch (error: any) {
    throw new AppError(
      "Error creating bulk users",
      500,
      error,
      false
    );
  }
};

export const deleteUsersById = async (userIds: string[]): Promise<boolean> => {
  logger.debug(`Deleting roles with id: ${userIds}`);
  try {
    const result = await User.destroy({
      where: {
        id: userIds,
      },
    })

    if (result === 0) {
      return false;
    };

    return true
  } catch (error: any) {
    throw new AppError(
      "error deleting users",
      500,
      error,
      false
    );
  }
};

export const addUsersToGroupById = async (data: {
  user_id: string,
  group_id: string
}[]): Promise<boolean> => {
  logger.info(`Adding usersIds to groups`)
  try {
    const questionTag = await UserGroup.bulkCreate(
      data
    );

    return !!questionTag;
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        'User already added to group',
        409,
        'User already added to group',
        false
      )
    } else if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(
        'Either user or group does not exist',
        404,
        'Either user or group does not exist',
        false
      )
    } else {
      throw new AppError(
        'Error adding tag to question',
        500,
        error,
        true
      )
    }
  }
}

export const removeUsersFromGroupById = async (data: {
  user_id: string,
  group_id: string
}[]): Promise<boolean> => {
  logger.info(`Removing usersIds to groups`)
  try {
    const result = await UserGroup.destroy({
      where: data,
    })

    if (result === 0) {
      return false;
    };

    return true
  } catch (error: any) {
    throw new AppError(
      'Error adding tag to question',
      500,
      error,
      true
    )
  }
} 
