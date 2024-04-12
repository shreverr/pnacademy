import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import Question from './question.schema';

const Option = sequelize.define('option', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Question,
        key: 'id'
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: true
    }
  });
  
  Option.belongsTo(Question, { foreignKey: 'questionId' });
  
  export default Option;