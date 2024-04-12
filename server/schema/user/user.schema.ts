import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
});

export default User;
