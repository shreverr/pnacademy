import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const Questions = sequelize.define('Questions', {
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  questionId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  testId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

export default Questions
