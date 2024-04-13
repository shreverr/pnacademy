import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface GroupAttributes {
  id: string
  name: string
}
class Group extends Model<GroupAttributes> implements GroupAttributes {
  public id!: string
  public name!: string
}
Group.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'group'
  }
)

export default Group
