import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'
import { ProgrammingLanguage, QuestionType } from '../../types/assessment.types'

export interface QuestionAttributes {
  id: string
  assessment_id: string
  description: string
  marks: number
  section: number
  image_key: string | null
  type: QuestionType
  time_limit: number | null
  allowed_languages: ProgrammingLanguage[] | null
}

class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: string
  public assessment_id!: string
  public description!: string
  public marks!: number
  public section!: number
  public image_key!: string
  public type!: QuestionType
  public time_limit!: number
  public allowed_languages!: ProgrammingLanguage[]
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
      type: DataTypes.TEXT,
      allowNull: false
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    section: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('MCQ', 'CODE'),
      defaultValue: 'MCQ',
      allowNull: false
    },
    image_key: {
      type: DataTypes.STRING,
      allowNull: true
    },
    time_limit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    allowed_languages: {
      type: DataTypes.ARRAY(
        DataTypes.STRING
      ),
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'question'
  }
)

export default Question
