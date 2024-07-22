import { promises as fs } from 'fs';
import logger from '../config/logger';
import { AppError } from '../lib/appError';

export const csvToObjectArray = async <T extends Record<string, string | boolean | null | number>>(
  filePath: string
): Promise<T[]> => {
  try {
    // Reads the file and returns a promise(string)  
    const csvData = await fs.readFile(filePath, { encoding: 'utf8' })
    logger.debug(csvData)

    // splits the string intot array of rows of csv file
    const csvArray = csvData.split('\n');
    logger.debug(csvArray)
    // splits the first row (header) of csv file into array of headers
    const headers = csvArray[0].split(',');

    const convertedData: T[] = []
    // makes an object of each row and pushes it into convertedData array
    for (let i = 1; i < csvArray.length; i++) {
      if (csvArray[i] === '') break;
      const rowData = csvArray[i].split(',');
      const row: Partial<T> = {}

      headers.forEach((header, index) => {
        (row as any)[header] = rowData[index] === '' ? null : rowData[index] ;
      })

      convertedData.push(row as T);
    }
    return convertedData;
  } catch (error: any) {
    throw new AppError('Error while parsing CSV file', 500, error, true);
  }
}
