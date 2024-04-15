import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserInDb,
} from "../../model/user/user.model";
import { UserData } from "../../types/user.types";
import { v4 as uuid } from "uuid";
import { AppError } from "../../lib/appError";
import { hashPassword } from "../../utils/password";
import commonErrorsDictionary from "../../utils/error/commonErrors";
import { promises } from "dns";

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
  id: string;

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
      'User not found',
      404,
      'User with this id does not exist',
      false
    )
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
      "kuch galat hogya",
      false
    );
  }
  return UpdatedUser;
};
