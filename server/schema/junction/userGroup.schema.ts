import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface UserGroupAttributes {
  user_id: string
  group_id: string
}

class UserGroup extends Model<UserGroupAttributes> implements UserGroupAttributes {
  public user_id!: string
  public group_id!: string
}

UserGroup.init(
  {
    user_id: {
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
    modelName: 'user_group'
  }
)

export default UserGroup
