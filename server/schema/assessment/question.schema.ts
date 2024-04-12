import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import Assessment from './assessment.schema';

const Question = sequelize.define('question', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
     
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  
 
  
export default Question;