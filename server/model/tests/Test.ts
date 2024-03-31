import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const Tests = sequelize.define('Tests', {
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  testId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Tests
