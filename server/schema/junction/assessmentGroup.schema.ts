import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface AssessmentGroupAttributes {
  assessment_id: string
  group_id: string
}

class AssessmentGroup extends Model<AssessmentGroupAttributes> implements AssessmentGroupAttributes {
  public assessment_id!: string
  public group_id!: string
}

AssessmentGroup.init(
  {
    assessment_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    group_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'assessment_group'
  }
)

export default AssessmentGroup
