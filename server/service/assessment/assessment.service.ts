import logger from "../../config/logger";
import { AppError } from "../../lib/appError";
import assessmentRepository from "../../repository/assessment.repository";
import { QueryOptions } from "../../repository/abstract.repository";
import { v4 as uuid } from 'uuid';
import Assessment, { AssessmentAttributes } from "../../schema/assessment/assessment.schema";
import { deleteFileFromS3, uploadFileToS3 } from "../../lib/file";
import { deleteFileFromDisk } from "../../lib/file";
import path from "path";
import { generatePresignedUrl } from "../../utils/s3";
import { scheduleAssessmentEndEvent } from "../../lib/assessment/event";

/**
 * Creates a new assessment with optional image upload functionality.
 * 
 * @param {Object} assessment - The assessment details
 * @param {string} assessment.name - The name of the assessment
 * @param {string} [assessment.imagePath] - Optional path to the assessment image file
 * @param {string} [assessment.description] - Optional description of the assessment
 * @param {boolean} assessment.isActive - Whether the assessment is active
 * @param {Date} assessment.startAt - The start date and time of the assessment
 * @param {Date} assessment.endAt - The end date and time of the assessment
 * @param {number} assessment.duration - The duration of the assessment in minutes
 * @param {boolean} assessment.isPublished - Whether the assessment is published
 * 
 * @returns {Promise<(Omit<AssessmentAttributes, 'imageKey'> & { imageUrl?: string }) | null>} 
 *          The created assessment object without the imageKey and with an optional imageUrl
 * 
 * @throws {AppError} When image upload fails
 * @throws {AppError} When assessment creation fails
 * @throws {AppError} When generating presigned URL fails
 * @throws {AppError} When scheduling assessment end event fails
 */
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
    }, 'assessments');
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

    assessmentRepository.delete(savedAssessment.id, 'assessments');

    throw new AppError(`Error scheduling assessment end event`, 500, error, true);
  }

  // Return assessment with image URL if it is provided
  return { ...savedAssessment.dataValues, imageUrl: presignedUrl };
};

export const getAssessments = async (query: {
  includes?: ('allowedDevices')[]
  search?: string,
  sort?: string,
  page?: number,
  limit?: number,
  filters?: Omit<AssessmentAttributes, 'search_vector' | 'imageKey'> | undefined,
  userId?: string
}, assigned: boolean)
  : Promise<{ data: Assessment[], totalPages: number }> => {
  let queryOptions: QueryOptions = {
    search: query.search,
    includes: query.includes,
    filters: query.filters,
    pagination: {
      page: query.page || 1,
      limit: query.limit || 10
    },
    sort: query.sort
  }

  const queryResult = await assessmentRepository.findAll(queryOptions, { cacheKeyPrefix: 'assessments' })

  const processedResults = await Promise.all(
    queryResult.rows.map(async (assessment) => {
      let assessmentWithImageUrl: any = {
        ...assessment.dataValues,
        imageKey: undefined // Remove imageKey from response
      }

      if (assessment.imageKey) {
        const imageUrl = await generatePresignedUrl(assessment.imageKey, 60 * 60);
        assessmentWithImageUrl = { ...assessmentWithImageUrl, imageUrl };

        return assessmentWithImageUrl;
      }

      return assessmentWithImageUrl;
    })
  );

  return {
    data: processedResults as Assessment[],
    totalPages: Math.ceil(queryResult.count / (query.limit || 10))
  }
};
