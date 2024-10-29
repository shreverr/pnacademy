import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

export interface NotificationAttributes {
  id: string;
  description: string;
  title: string;
  image_key: string | null;
  file_key: string | null;
}
class Notification
  extends Model<NotificationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public description!: string;
  public title!: string;
  public image_key!: string | null;
  public file_key!: string | null;
}
Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "notification",
  }
);

export default Notification;
