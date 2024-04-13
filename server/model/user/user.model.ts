import { sequelize } from "../../config/database";
import logger from "../../config/logger";
import { AppError } from "../../lib/appError";
import Password from "../../schema/user/password.schema";
import User from "../../schema/user/user.schema";
import { UserData } from "../../types/user.types";

export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const user = User.findOne({
      where: {
        email: email
      },
      raw: true
    })

    return user;
  } catch (error) {
    throw new AppError('error getting user by email', 500, 'Something went wrong', false);
  }
}

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
    const user = await User.create({
      id: userData.id,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      role_id: userData.roleId,
    }, { transaction, raw: true });

    await Password.create({
      user_id: userData.id,
      password: userData.password,
    }, { transaction, raw: true });

    await transaction.commit();
    return user;
  } catch (error) {
    // Rollback transaction if there's an error
    await transaction.rollback();
    throw new AppError('error creating user', 500, 'Something went wrong', false);
  }
}