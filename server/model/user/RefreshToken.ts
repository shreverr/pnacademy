import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const RefreshToken = sequelize.define('RefreshToken', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

export default RefreshToken
 