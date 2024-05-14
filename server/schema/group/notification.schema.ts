import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database";

interface NotificationAttributes {
  id: string;
  description: string;
  title: string;
  image_url: string | null;
  file_url: string | null;
}
class Notification
  extends Model<NotificationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public description!: string;
  public title!: string;
  public image_url!: string | null;
  public file_url!: string | null;
}
Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "notification",
  }
);

export default Notification;
