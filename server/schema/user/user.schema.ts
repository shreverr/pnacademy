import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

interface UserAttributes {
  id: string;
  role_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public role_id: string | null = null;
  public email!: string;
  public phone: string | null = null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone:  {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'user'
  }
);

export default User;
