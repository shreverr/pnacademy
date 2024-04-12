import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database";

const Notification = sequelize.define("notification", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  file_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
export default Notification;
