import { UUID } from "crypto";
import { getAssessmentById, getAssessmentStatusById, getSectionStatusesById } from "../../model/assessment/assesment.model";
import { AppError } from "../appError";
import { AssementDetailedData } from "../../types/assessment.types";

export const validateAssessment = async (assessmentId: string): Promise<AssementDetailedData> => {
  const assessment = await getAssessmentById(assessmentId as UUID);
  if (!assessment) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist",
      false
    );
  }

  const currentTime = Date.now();

  if (currentTime < assessment.start_at.getTime()) {
    throw new AppError(
      "Assessment not started",
      403,
      "Assessment has not started yet",
      false
    );
  }

  if (currentTime > assessment.end_at.getTime()) {
    throw new AppError(
      "Assessment ended",
      403,
      "Assessment has ended",
      false
    );
  }

  return assessment;
};

export const validateAssessmentEnd = async (assessmentId: string): Promise<AssementDetailedData> => {
  const assessment = await getAssessmentById(assessmentId as UUID);
  if (!assessment) {
    throw new AppError(
      "Assessment not found",
      404,
      "Assessment with this id does not exist",
      false
    );
  }

  const currentTime = Date.now();

  if (currentTime < assessment.end_at.getTime()) {
    throw new AppError(
      "Assessment not ended yet",
      403,
      "Assessment not ended yet",
      false
    );
  }

  return assessment;
};

export const validateAssessmentStatus = async (assessmentId: string, userId: string) => {
  const assessmentStatus = await getAssessmentStatusById(assessmentId, userId);

  if (assessmentStatus.started_at === null) {
    throw new AppError(
      'Assessment not started',
      404,
      'Assessment not started',
      false
    );
  }

  if (assessmentStatus.submitted_at !== null) {
    throw new AppError(
      'Assessment has ended',
      404,
      'Assessment has ended',
      false
    );
  }

  return assessmentStatus;
};

export const validateSectionStatus = async (
  assessmentId: string,
  userId: string,
  section: number
) => {
  const sectionStatuses = (await getSectionStatusesById(assessmentId, userId)).rows;

  sectionStatuses.forEach((sectionStatus) => {
    if (sectionStatus.section === section && sectionStatus.is_submited === true) {
        throw new AppError(
          'Section already submitted',
          409,
          'Section already submitted',
          false
        );
      }

    if (sectionStatus.section !== section && sectionStatus.is_submited === false) {
      throw new AppError(
        'Previous section not submitted',
        409,
        'Previous section not submitted',
        false
      );
    }
  });

  return sectionStatuses;
};
