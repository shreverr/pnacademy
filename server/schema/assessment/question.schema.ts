import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface QuestionAttributes {
  id: string
  assessment_id: number
  description: string
  marks: number
}
class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: string
  public assessment_id!: number
  public description!: string
  public marks!: number
}
Question.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'question'
  }
)

export default Question
