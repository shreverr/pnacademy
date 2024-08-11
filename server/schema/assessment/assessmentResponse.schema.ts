import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export interface AssessmentResponseAttributes {
  assessment_id: string
  user_id: string
  question_id: string
  selected_option_id: string
}
class AssessmentResponse extends Model<AssessmentResponseAttributes> implements AssessmentResponseAttributes {
  public assessment_id!: string
  public user_id!: string
  public question_id!: string
  public selected_option_id!: string
}
AssessmentResponse.init(
  {
    assessment_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    selected_option_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'assessment_response'
  }
)

export default AssessmentResponse
