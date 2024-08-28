import { LambdaClient } from "@aws-sdk/client-lambda";
import { AppError } from "../lib/appError";

const awsRegion = process.env.AWS_REGION;
if (!awsRegion)
  throw new AppError(
    "Internal server error",
    500,
    "AWS region not found",
    false
  );

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
if (!awsAccessKeyId)
  throw new AppError(
    "Internal server error",
    500,
    "AWS S3 key ID not found",
    false
  );

const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!awsSecretAccessKey)
  throw new AppError(
    "Internal server error",
    500,
    "AWS S3 secret access key not found",
    false
  );

const lambdaClient = new LambdaClient({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

export default lambdaClient;
