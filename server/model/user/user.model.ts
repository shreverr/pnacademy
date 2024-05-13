import { sequelize } from '../../config/database'
import logger from '../../config/logger'
import { AppError } from '../../lib/appError'
import Password from '../../schema/user/password.schema'
import RefreshToken from '../../schema/user/refreshToken.schema'
import Role from '../../schema/user/role.schema'
import User from '../../schema/user/user.schema'
import { type RefreshTokenData, type RoleData, type UserData } from '../../types/user.types'

export const getUserByEmail = async (
  email: string
): Promise<UserData | null> => {
  try {
    const user = User.findOne({
      where: {
        email
      },
      raw: true
    })

    return await user
  } catch (error) {
    throw new AppError(
      'error getting user by email',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const user = User.findOne({
      where: {
        id
      },
      raw: true
    })
    return await user
  } catch (error) {
    throw new AppError(
      'error getting user by id',
      500,
      'Something went wrong',
      false
    )
  }
}

export const createUser = async (userData: {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string | null
  roleId: string | null
}): Promise<UserData | null> => {
  logger.info(`Creating user with email: ${userData.email}`)
  const transaction = await sequelize.transaction()
  try {
    const user = await User.create(
      {
        id: userData.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role_id: userData.roleId
      },
      { transaction, raw: true }
    )

    await Password.create(
      {
        user_id: userData.id,
        password: userData.password
      },
      { transaction, raw: true }
    )

    await transaction.commit()
    return user
  } catch (error) {
    // Rollback transaction if there's an error
    await transaction.rollback()
    throw new AppError(
      'error creating user',
      500,
      'Something went wrong',
      false
    )
  }
}

export const updateUserInDb = async (userData: {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  roleId: string | null
}): Promise<UserData | null> => {
  logger.info(`Updating user with id ${userData.id}`)

  try {
    const updateData: any = {
      first_name: userData.firstName ?? undefined,
      last_name: userData.lastName ?? undefined,
      email: userData.email ?? undefined,
      phone: userData.phone ?? undefined,
      role_id: userData.roleId ?? undefined
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    )

    if (Object.keys(updateData).length === 0) {
      return null
    }

    const [_, [updatedUser]] = await User.update(updateData, {
      where: {
        id: userData.id
      },
      returning: true
    })

    return updatedUser.dataValues as UserData
  } catch (error) {
    throw new AppError(
      'error updating user',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getPasswordById = async (id: string): Promise<Password | null> => {
  try {
    const password = await Password.findOne({
      where: {
        user_id: id
      },
      raw: true
    })

    return password
  } catch (error) {
    throw new AppError(
      'error getting password by id',
      500,
      'Something went wrong',
      false
    )
  }
}

export const createRoleInDB = async (
  role: RoleData
): Promise<RoleData | null> => {
  logger.info(`Creating role: ${role.name}`)
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
        canViewNotification: role.canViewNotification
      },
      {
        raw: true
      }
    )
    return createdRole
  } catch (error) {
    throw new AppError(
      'error creating role',
      500,
      'Something went wrong',
      false
    )
  }
}

export const getRoleById = async (id: string): Promise<RoleData | null> => {
  logger.info(`Fetching role by id: ${id}`)
  try {
    const role = await Role.findOne({
      where: {
        id
      }
    })
    return role
  } catch (error) {
    throw new AppError(
      'error finding role',
      500,
      'Something went wrong',
      false
    )
  }
}

export const saveRefreshToken = async (token: {
  userId: string
  refreshToken: string
}): Promise<RefreshTokenData> => {
  logger.info(`Saving refresh token for ${token.userId}`)
  try {
    const refreshToken = await RefreshToken.create({
      user_id: token.userId,
      refresh_token: token.refreshToken
    }, {
      raw: true
    })
    return refreshToken
  } catch (error) {
    throw new AppError(
      'error finding role',
      500,
      'Something went wrong',
      true
    )
  }
}
