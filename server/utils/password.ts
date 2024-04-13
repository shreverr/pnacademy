import { randomBytes, pbkdf2 } from 'crypto';
import { promisify } from 'util';
import { AppError } from '../lib/appError';

const randomBytesAsync = promisify(randomBytes);
const pbkdf2Async = promisify(pbkdf2);

const hashPassword = async (password: string): Promise<string> => {
  try {
    // Generate a salt
    const salt = await randomBytesAsync(32);
    // Hash the password
    const derivedKey = await pbkdf2Async(password, salt, 10000, 64, 'sha512');
    // Convert derivedKey to hex string
    const hashedPassword = derivedKey.toString('hex');
    
    return hashedPassword;
  } catch (error) {
    // Handle errors
    throw new AppError('Error generating or hashing password', 500, (error as Error).message, false);
  }
}

export { hashPassword };
