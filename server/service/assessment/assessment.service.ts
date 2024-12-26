import logger from "../../config/logger";
import { AppError } from "../../lib/appError";
import assessmentRepository from "../../repository/assessment.repository";
import { v4 as uuid } from 'uuid';
import Assessment, { AssessmentAttributes } from "../../schema/assessment/assessment.schema";
import { deleteFileFromS3, uploadFileToS3 } from "../../lib/file";
import { deleteFileFromDisk } from "../../lib/file";
import path from "path";
import { generatePresignedUrl } from "../../utils/s3";
import { scheduleAssessmentEndEvent } from "../../lib/assessment/event";


export const createAssessment = async (assessment: {
  name: string
  imagePath?: string;
  description?: string
  isActive: boolean
  startAt: Date
  endAt: Date
  duration: number
  isPublished: boolean
}): Promise<Omit<AssessmentAttributes, 'imageKey'> & { imageUrl?: string } | null> => {
  let imageKey: string | undefined = undefined;
  
  // Upload image to S3 if provided
  if (assessment.imagePath) {
    try {
      imageKey = `assessment-images/${uuid()}${path.extname(assessment.imagePath)}`;
      await uploadFileToS3(assessment.imagePath, imageKey, "image");
      deleteFileFromDisk(assessment.imagePath);
      delete assessment.imagePath;
    } catch (error: any) {
      throw new AppError(`Error uploading image to S3`, 500, error, true);
    }
  }

  // Create assessment in database
  let savedAssessment: Assessment
  try {  
    savedAssessment = await assessmentRepository.create({
      ...assessment,
      id: uuid(),
      imageKey: imageKey
    });
    logger.info(`Assessment created successfully: ${savedAssessment.id}`);
  } catch (error: any) {
    if (imageKey) {
      await deleteFileFromS3(imageKey);
    }
    
    throw new AppError(`Error creating assessment`, 500, error, true);
  }

  // Generate presigned URL for image if image key is provided
  let presignedUrl: string | undefined = undefined;
  if (imageKey) {
    try {
      presignedUrl = await generatePresignedUrl(imageKey, 60 * 60);
    } catch (error: any) {
      throw new AppError(`Error generating presigned URL`, 500, error, true);
    }
  }

  // Delete image key 
  delete savedAssessment.dataValues.imageKey;

  try {
    await scheduleAssessmentEndEvent(savedAssessment.id, savedAssessment.endAt);
  } catch (error: any) {
    if (imageKey) {
      await deleteFileFromS3(imageKey);
    }
    
    assessmentRepository.delete(savedAssessment.id);

    throw new AppError(`Error scheduling assessment end event`, 500, error, true);
  }

  // Return assessment with image URL if it is provided
  return { ...savedAssessment.dataValues, imageUrl: presignedUrl };
};