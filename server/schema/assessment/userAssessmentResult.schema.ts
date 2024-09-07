import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export interface UserAssessmentResultAttributes {
  id: string
  assessment_id: string
  user_id: string
  correct_answers_count: number
  marks_scored: number
  wrong_answers_count: number
  correct_percentage: number
  createdAt?: Date; // Automatically added by sequelize
  updatedAt?: Date; // Automatically added by sequelize
}

class UserAssessmentResult
  extends Model<UserAssessmentResultAttributes>
  implements UserAssessmentResultAttributes {
  public id!: string
  public assessment_id!: string
  public user_id!: string
  public correct_answers_count!: number
  public marks_scored!: number
  public wrong_answers_count!: number
  public correct_percentage!: number

}

UserAssessmentResult.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    assessment_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    correct_answers_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    marks_scored: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    correct_percentage: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    wrong_answers_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'user_assessment_result',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['assessment_id', 'user_id'] // Unique constraint on combo of assessment_id and user_id
      }
    ]
  }
)

export default UserAssessmentResult
