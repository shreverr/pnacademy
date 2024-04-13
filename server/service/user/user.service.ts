import { createUser, getUserByEmail } from "../../model/user/user.model";
import { UserData } from "../../types/user.types";
import { v4 as uuid } from 'uuid';
import { AppError } from "../../lib/appError";
import { hashPassword } from "../../utils/password";
import commonErrorsDictionary from "../../utils/error/commonErrors";


export const registerUser = async (user: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string | null;
  roleId: string | null;
}): Promise<UserData | null> => {

  const userExists = await getUserByEmail(user.email);
  if (userExists) throw new AppError('User already exists', 409, 'User with this email already exists', false)

  const userData = await createUser({
    id: uuid(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: await hashPassword(user.password),
    phone: user.phone,
    roleId: user.roleId,
  })

  if (!userData) {
    throw new AppError(
      commonErrorsDictionary.internalServerError.name,
      commonErrorsDictionary.internalServerError.httpCode,
      'Someting went wrong',
      false
    )
  }

  return userData;
}