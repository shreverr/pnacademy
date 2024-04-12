import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import Question from './question.schema';

const Option = sequelize.define('option', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
     
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: false
    }
  });
  

  
  export default Option;