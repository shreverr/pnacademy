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
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });
  
  Question.belongsTo(Assessment, { foreignKey: 'assessmentId' });
  
export default Question;