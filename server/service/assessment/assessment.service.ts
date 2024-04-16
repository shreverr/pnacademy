import { UUID } from "crypto";
import { createAssementInDB } from "../../model/assessment/assesment.model";
import { AssementData } from "../../types/assessment.types";
import { v4 as uuid } from "uuid";
import { getUserById } from "../../model/user/user.model";
import { AppError } from "../../lib/appError";

export const createAssessment = async (assement: {
  name: string;
  description: string;
  is_active: boolean;
  start_at: Date;
  end_at: Date;
  duration: number;
  created_by: UUID;
}): Promise<AssementData | null> => {
  const existingUser = await getUserById(assement.created_by);
  if (!existingUser) {
    throw new AppError(
      "User not found",
      404,
      "User with this id does not exist so Can't create assessment",
      false
    );
  }
  const assementData = await createAssementInDB({
    id: uuid(),
    name: assement.name,
    description: assement.description,
    is_active: assement.is_active,
    start_at: assement.start_at,
    end_at: assement.end_at,
    duration: assement.duration,
    created_by: assement.created_by,
  });
  return assementData;
};
