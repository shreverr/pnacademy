import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const Password = sequelize.define('password', {
  user_id : {
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
