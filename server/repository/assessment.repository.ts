import AbstractRepository from './abstract.repository'; 
import Assessment from '../schema/assessment/assessment.schema';
import ProctoringOptions from '../schema/assessment/proctoringOptions.schema';
class AssessmentRepository extends AbstractRepository<Assessment> {
  constructor() {
    super(Assessment);

    this.registerInclude('allowedDevices', {
      model: ProctoringOptions,
      attributes: ['allowedDevices'],
    });
  }

  // Add model-specific methods if needed
}

export default new AssessmentRepository();
