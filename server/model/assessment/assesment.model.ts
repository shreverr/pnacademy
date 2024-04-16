import { UUID } from "crypto";
import { AssementData } from "../../types/assessment.types";
import { AppError } from "../../lib/appError";
import logger from "../../config/logger";
import Assessment from "../../schema/assessment/assessment.schema";

export const createAssementInDB = async (assessment: {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: UUID;
}): Promise<AssementData | null> => {
  logger.info(`Creating assessment: ${assessment.name}`);

  try {
    // Create the assessment
    const createdAssessment = await Assessment.create(
      {
        id: assessment.id,
        name: assessment.name,
        description: assessment.description,
        is_active: assessment.is_active,
        start_at: assessment.start_at,
        end_at: assessment.end_at,
        duration: assessment.duration,
        created_by: assessment.created_by,
      },
      {
        raw: true,
      }
    );
    return createdAssessment;
  } catch (error) {
   
    throw new AppError(
      "Error creating assessment",
      500,
      "Something went wrong",
      false
    );
  }
};
