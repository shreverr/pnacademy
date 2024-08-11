import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export interface SectionStatusAttributes {
  assessment_id: string
  section: number
  is_submited: boolean
  user_id: string
}
class SectionStatus extends Model<SectionStatusAttributes> implements SectionStatusAttributes {
  public assessment_id!: string
  public section!: number
  public is_submited!: boolean
  public user_id!: string
}
SectionStatus.init(
  {
    assessment_id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    is_submited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    section: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  },
  { 
    sequelize,
    modelName: 'section_status'
  }
)

export default SectionStatus
