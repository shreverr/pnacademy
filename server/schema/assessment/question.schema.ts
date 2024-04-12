import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import Assessment from './assessment.schema';

const Question = sequelize.define('question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Assessment,
        key: 'id'
      }
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
  
  Question.belongsTo(Assessment, { foreignKey: 'assessmentId' });
  
export default Question;