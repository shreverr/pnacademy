import { sequelize } from '../../config/database'
import logger from '../../config/logger'
import { AppError } from '../../lib/appError'
import Password from '../../schema/user/password.schema'
import User from '../../schema/user/user.schema'
import { type UserData } from '../../types/user.types'

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
