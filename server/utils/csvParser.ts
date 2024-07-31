import { promises as fs } from 'fs';
import logger from '../config/logger';
import { AppError } from '../lib/appError';
import path from 'path';
import { nanoid } from 'nanoid';

const tempStorageDir = process.env.TEMP_DIR;
if (!tempStorageDir) {
  throw new AppError(
    "environment variable not set",
    500,
    "TEMP_DIR not set",
    false
  );
}

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
        (row as any)[header] = rowData[index] === '' ? null : rowData[index];
      })

      convertedData.push(row as T);
    }
    return convertedData;
  } catch (error: any) {
    throw new AppError('Error while parsing CSV file', 500, error, true);
  }
}

export const objectArrayToCSV = async <T extends Record<string, string | boolean | null | number | Date>>(data: T[]): Promise<string> => {
  try {

    if (!data || data.length === 0) return '';
    logger.debug(data)

    let csvData = '';

    const headers = Object.keys(data[0]);
    //place all headers as first row of csv file
    headers.forEach((header, index) => {
      csvData += header;
      if (index !== headers.length - 1) {
        csvData += ','
      } else {
        csvData += '\n';
      }
    })

    // place all values of each row in CSV file
    data.forEach((row, index) => {
      headers.forEach((header, index) => {
        const value = row[header];
        if (value instanceof Date) {
          // Format the date as ISOString
          csvData += value.toISOString();
        } else {
          csvData += value !== null && value !== undefined ? String(value) : '';
        }

        if (index !== headers.length - 1) {
          csvData += ','
        } else {
          csvData += '\n';
        }
      })
    })

    logger.debug(csvData)

    const writePath = path.join(tempStorageDir, `${nanoid(5)}-exported-users.csv`)
    await fs.writeFile(writePath, csvData);

    return writePath;
  } catch (error: any) {
    throw new AppError('Error while converting data to CSV', 500, error, true);
  }
}