import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface NotificationGroupAttributes {
  notification_id: string
  group_id: string
}

class NotificationGroup extends Model<NotificationGroupAttributes> implements NotificationGroupAttributes {
  public notification_id!: string
  public group_id!: string
}

NotificationGroup.init(
  {
    notification_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    group_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'notification_group'
  }
)

export default NotificationGroup
