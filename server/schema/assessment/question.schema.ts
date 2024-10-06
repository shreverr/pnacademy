import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export interface QuestionAttributes {
  id: string
  assessment_id: string
  description: string
  marks: number
  section: number
}
class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: string
  public assessment_id!: string
  public description!: string
  public marks!: number
  public section!: number
}
Question.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    assessment_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    section: {
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
