import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface SectionAttributes {
  assessment_id: string
  section: number
}

class Section extends Model<SectionAttributes> implements SectionAttributes {
  public assessment_id!: string
  public section!: number
}

Section.init(
  {
    assessment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    section: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'section',
  }
)

export default Section
