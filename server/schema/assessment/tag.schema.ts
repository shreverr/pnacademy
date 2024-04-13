import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface TagAttributes {
  id: string
  name: string
}
class Tag extends Model<TagAttributes> implements TagAttributes {
  public id!: string
  public name!: string
}
Tag.init(
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
    modelName: 'tag'
  }
)

export default Tag
