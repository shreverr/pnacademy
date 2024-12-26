import AbstractRepository from './abstract.repository'; 
import Assessment from '../schema/assessment/assessment.schema';
class AssessmentRepository extends AbstractRepository<Assessment> {
  constructor() {
    super(Assessment);
  }

  // Add model-specific methods if needed
}

export default new AssessmentRepository();
