import { AddPermissionCommand, AddPermissionCommandInput, LambdaClient } from "@aws-sdk/client-lambda";
import { AppError } from "../lib/appError";
import logger from "./logger";

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

const assessmentAnalyticsComputeLambdaARN = process.env.AWS_ASSESSMENT_ANALYTICS_COMPUTE_LAMBDA_ARN

if (!assessmentAnalyticsComputeLambdaARN) {
  throw new AppError(
    "Internal server error",
    500,
    "AWS assessment analytics compute lambda ARN not found",
    false
  );
}

export const addGeneralPermissionToLambda = async () => {
  try {
    const addPermissionToLambdaParams: AddPermissionCommandInput = {
      FunctionName: assessmentAnalyticsComputeLambdaARN,
      StatementId: 'EventBridge-AssessmentEndInvoke',
      Action: 'lambda:InvokeFunction',
      Principal: 'events.amazonaws.com',
      SourceArn: `arn:aws:events:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:rule/assessment-end-*`
    };

    const addPermissionToLambdaCommand = new AddPermissionCommand(addPermissionToLambdaParams);
    await lambdaClient.send(addPermissionToLambdaCommand);
    logger.info('General permission added to Lambda function');
  } catch (error: any) {
    if (error.name === 'ResourceConflictException') {
      logger.info('Permission already exists, skipping');
    } else {
      throw new AppError('Error adding general permission to Lambda', 500, error, true);
    }
  }
}

export default lambdaClient;
