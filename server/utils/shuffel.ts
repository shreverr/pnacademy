import crypto from 'crypto';
import { AppError } from '../lib/appError';


interface ObjectWithId {
  id: string | number;
  [key: string]: any;
}

const generateSeed = async (userId: string, assessmentId: string): Promise<number> => {
  const key = `${userId}:${assessmentId}`;
  try {
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    return parseInt(hash.slice(0, 8), 16);
  } catch (error: any) {
    throw new AppError(
      'SeedGenerationError',
      500,
      error,
      true
    );
  }
};

const seedrandom = (seed: number): (() => number) => {
  let state = seed;
  return (): number => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
};

const fisherYatesShuffle = <T extends ObjectWithId>(array: T[], randomGenerator: () => number): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(randomGenerator() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const consistentRandomizer = async <T extends ObjectWithId>(
  userId: string,
  assessmentId: string,
  arrayOfObjects: T[]
): Promise<T[]> => {
  if (!userId || !assessmentId) {
    throw new AppError(
      'InvalidInputError',
      400,
      'Invalid userId or assessmentId',
      true
    );
  }
  if (!Array.isArray(arrayOfObjects) || arrayOfObjects.length === 0) {
    throw new AppError(
      'InvalidInputError',
      400,
      'Invalid or empty arrayOfObjects',
      true
    );
  }

  try {
    const seed = await generateSeed(userId, assessmentId);
    const randomGenerator = seedrandom(seed);
    return fisherYatesShuffle(arrayOfObjects, randomGenerator);
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'RandomizationError',
      500,
      error,
      true
    );
  }
};

export default consistentRandomizer;