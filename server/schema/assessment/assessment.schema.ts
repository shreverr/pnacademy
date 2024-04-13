import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface AssessmentAttributes {
  id: string
  name: string
  description: string | null
  is_active: boolean
  start_at: Date
  end_at: Date
  duration: string | null
  created_by: number
}
class Assessment
  extends Model<AssessmentAttributes>
  implements AssessmentAttributes {
  public id!: string
  public name!: string
  public description: string | null = null
  public is_active!: boolean
  public start_at!: Date
  public end_at!: Date
  public duration: string | null = null
  public created_by!: number
}
Assessment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'assessment'
  }
)

export default Assessment
