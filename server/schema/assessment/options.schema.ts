import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface OptionAttributes {
  id: string
  question_id: number
  description: string
  is_correct: boolean
}
class Option extends Model<OptionAttributes> implements OptionAttributes {
  public id!: string
  public question_id!: number
  public description!: string
  public is_correct!: boolean
}
Option.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'option'
  }
)

export default Option
