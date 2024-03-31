import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const options = sequelize.define('options', {
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  questionId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  optionId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  optionText: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
})

export default options
