import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/database'

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // password: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: false
  }
})

export default User
