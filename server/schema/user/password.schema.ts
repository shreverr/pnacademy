import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

interface PasswordAttributes {
  user_id: string;
  password: string;
}

class Password extends Model<PasswordAttributes> implements PasswordAttributes {
  public user_id!: string;
  public password!: string;
}

Password.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'password'
  }
);

export default Password;
