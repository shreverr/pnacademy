import s3Client from "../config/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "../lib/appError";
import logger from "../config/logger";

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
  throw new AppError(
    "Internal server error",
    500,
    "AWS S3 bucket name not found",
    false
  );
}

export const generatePresignedUrl = async (key: string, expiresInSeconds: number): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,           // Name of the file in S3
    });

    // Generate a pre-signed URL
    const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
    
    return url;
  } catch (error) {
    throw new AppError(
      "Internal server error",
      500,
      "Error generating pre-signed URL",
      false
    );
  }
};
