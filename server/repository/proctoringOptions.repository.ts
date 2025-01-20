import AbstractRepository from './abstract.repository'; 
import ProctoringOptions from '../schema/assessment/proctoringOptions.schema';

class ProctoringOptionsRepository extends AbstractRepository<ProctoringOptions> {
  constructor() {
    super(ProctoringOptions);
  }

  // Add model-specific methods if needed
}

export default new ProctoringOptionsRepository();
