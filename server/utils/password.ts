import { randomBytes, pbkdf2 } from 'crypto';
import { promisify } from 'util';
import { AppError } from '../lib/appError';
import bcrypt from 'bcrypt'

const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt())

    return hashedPassword;
  } catch (error) {
    throw new AppError('Error hashing password', 500, (error as Error).message, false);
  }
}

export { hashPassword };
