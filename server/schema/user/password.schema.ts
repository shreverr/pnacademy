import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";
import User from "./user.schema";

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
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "password",
  }
);

export default Password;
