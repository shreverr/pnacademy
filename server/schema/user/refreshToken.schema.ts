import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const RefreshToken = sequelize.define('refresh_token', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  refresh_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

export default RefreshToken