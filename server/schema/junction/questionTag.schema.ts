import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface QuestionTagAttributes {
  question_id: string
  tag_id: string
}

class QuestionTag extends Model<QuestionTagAttributes> implements QuestionTagAttributes {
  public question_id!: string
  public tag_id!: string
}

QuestionTag.init(
  {
    question_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tag_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'question_tag'
  }
)

export default QuestionTag
