import fs from "fs/promises";
import { AppError } from "./appError";
import s3Client from "../config/s3";
import { DeleteObjectCommand, DeleteObjectCommandOutput, GetObjectAclCommand, GetObjectAclCommandOutput, GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import logger from "../config/logger";
import path from "path";
import { createWriteStream } from "fs";
import archiver from "archiver";

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
  throw new AppError(
    "Internal server error",
    500,
    "AWS S3 bucket name not found",
    false
  );
}

const tempStorageDir = process.env.TEMP_DIR;
if (!tempStorageDir) {
  throw new AppError(
    "environment variable not set",
    500,
    "TEMP_DIR not set",
    false
  );
}

export const deleteFileFromDisk = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    throw new AppError(`Error deleting file ${filePath}`, 500, error, true);
  }
}

export const uploadFileToS3 = async (filePath: string, key: string, typeOfFile: 'image' | 'other'): Promise<PutObjectCommandOutput> => {
  try {
    logger.info('Uploading file to S3')
    const fileContent = await fs.readFile(filePath);

    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,             // Name of the file in S3
      Body: fileContent,
    };

    if (typeOfFile === 'image') {
      params.ContentType = 'image/jpeg'
    }

    const data = await s3Client.send(new PutObjectCommand(params));

    return data
  } catch (error: any) {
    throw new AppError(
      `S3 File upload error`,
      500,
      error,
      true
    )
  }
}

export const deleteFileFromS3 = async (key: string): Promise<DeleteObjectCommandOutput> => {
  try {
    logger.info('Deleting file from S3')

    const params = {
      Bucket: bucketName,
      Key: key,             // Name of the file in S3
    };

    const data = await s3Client.send(new DeleteObjectCommand(params));

    return data
  } catch (error: any) {
    throw new AppError(
      `S3 file delete error`,
      500,
      error,
      true
    )
  }
}

export const saveDataToDisk = async (data: string, filename: string): Promise<string> => {
  const filePath = path.join(tempStorageDir, filename);

  await fs.writeFile(filePath, data, 'utf8');

  return filePath;
};

export const createArchive = async (filePaths: string[], archiveName: string): Promise<string> => {
  const archivePath = path.join(tempStorageDir, `${archiveName}.zip`);
  const output = createWriteStream(archivePath);
  const archive = archiver('zip');

  return new Promise((resolve, reject) => {
      output.on('close', () => {
          resolve(archivePath);
      });

      archive.on('error', (err) => {
          reject(err);
      });

      archive.pipe(output);

      filePaths.forEach(filePath => {
          archive.file(filePath, { name: path.basename(filePath) });
      });

      archive.finalize();
  });
}
