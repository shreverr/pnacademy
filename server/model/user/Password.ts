import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const Password = sequelize.define('Password', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

export default Password
