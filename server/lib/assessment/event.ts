import {
  DeleteRuleCommand,
  PutRuleCommand,
  PutRuleCommandInput,
  PutTargetsCommand,
  PutTargetsCommandInput,
} from "@aws-sdk/client-eventbridge";
import logger from "../../config/logger";
import { AppError } from "../appError";
import eventBridgeClient from "../../config/eventBridge";
import lambdaClient from "../../config/lambdaClient";
import { AddPermissionCommand, AddPermissionCommandInput } from "@aws-sdk/client-lambda";

const assessmentAnalyticsComputeLambdaARN = process.env.AWS_ASSESSMENT_ANALYTICS_COMPUTE_LAMBDA_ARN

if (!assessmentAnalyticsComputeLambdaARN) {
  throw new AppError(
    "Internal server error",
    500,
    "AWS assessment analytics compute lambda ARN not found",
    false
  );
}

export const scheduleAssessmentEndEvent = async (
  assessmentId: string,
  endAtUTC: Date
): Promise<void> => {
  try {
    logger.info("Scheduling assessment end event")

    endAtUTC = new Date(endAtUTC);
    const endAtCronExpression = `cron(${endAtUTC.getUTCMinutes()} ${endAtUTC.getUTCHours()} ${endAtUTC.getUTCDate()} ${endAtUTC.getUTCMonth() + 1} ? ${endAtUTC.getUTCFullYear()})`;
    const ruleName = `assessment-end-${assessmentId}`;

    const assementEndEventRuleParams: PutRuleCommandInput = {
      Name: ruleName,
      ScheduleExpression: endAtCronExpression,
      State: "ENABLED",
    };

    const putAssessmentEndEventRule = new PutRuleCommand(assementEndEventRuleParams);
    const assementEventRuleData = await eventBridgeClient.send(putAssessmentEndEventRule);

    const putAssessmentEndEventTargetParams: PutTargetsCommandInput = {
      Rule: ruleName,
      Targets: [
        {
          Id: `assessment-end-target-${assessmentId}`,
          Arn: assessmentAnalyticsComputeLambdaARN,
          Input: JSON.stringify({ assessmentId }),
        },
      ],
    }

    const putAssessmentEndEventTarget = new PutTargetsCommand(putAssessmentEndEventTargetParams);
    await eventBridgeClient.send(putAssessmentEndEventTarget);

    const addPermissionToLambdaParams: AddPermissionCommandInput = {
      FunctionName: assessmentAnalyticsComputeLambdaARN,
      StatementId: `assessment-end-invoke-permission-${assessmentId}`,
      Action: "lambda:InvokeFunction",
      Principal: "events.amazonaws.com",
      SourceArn: assementEventRuleData.RuleArn
    }

    const addPermissionToLambdaCommand = new AddPermissionCommand(addPermissionToLambdaParams);
    await lambdaClient.send(addPermissionToLambdaCommand);

  } catch (error: any) {
    throw new AppError(
      `Error scheduling assessment end event`,
      500,
      error,
      true
    );
  }
};

export const updateAssessmentEndEventSchedule = async (
  assessmentId: string,
  endAtUTC: Date
): Promise<void> => {
  try {
    logger.info("Updating assessment end event schedule")

    endAtUTC = new Date(endAtUTC);
    const endAtCronExpression = `cron(${endAtUTC.getUTCMinutes()} ${endAtUTC.getUTCHours()} ${endAtUTC.getUTCDate()} ${endAtUTC.getUTCMonth() + 1} ? ${endAtUTC.getUTCFullYear()})`;
    const ruleName = `assessment-end-${assessmentId}`;

    const assementEndEventRuleParams: PutRuleCommandInput = {
      Name: ruleName,
      ScheduleExpression: endAtCronExpression,
      State: "ENABLED",
    };

    const putAssessmentEndEventRule = new PutRuleCommand(assementEndEventRuleParams);
    await eventBridgeClient.send(putAssessmentEndEventRule);

  } catch (error: any) {
    throw new AppError(
      `Error updating assessment end event schedule`,
      500,
      error,
      true
    );
  }
};

export const deleteEventRule = async (assessmentId: string): Promise<void> => {
  try {
    logger.info(`Deleting EventBridge rule`);
    const ruleName = `assessment-end-${assessmentId}`;
    
    const deleteRuleParams = {
      Name: ruleName,
    };

    const deleteRuleCommand = new DeleteRuleCommand(deleteRuleParams);
    await eventBridgeClient.send(deleteRuleCommand);
    
  } catch (error: any) {
    throw new AppError(
      `Error deleting EventBridge rule`,
      500,
      error,
      true
    );
  }
};