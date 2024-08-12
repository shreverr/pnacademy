import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export interface AssessmentStatusAttributes {
  assessment_id: string
  user_id: string
  started_at: Date
  submitted_at: Date
}
class AssessmentStatus extends Model<AssessmentStatusAttributes> implements AssessmentStatusAttributes {
  public assessment_id!: string
  public user_id!: string
  public started_at!: Date
  public submitted_at!: Date
}
AssessmentStatus.init(
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
    started_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'assessment_status'
  }
)

export default AssessmentStatus
