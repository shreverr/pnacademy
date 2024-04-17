import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface AssessmentAttributes {
  id: string
  name: string
  description: string
  is_active: boolean
  start_at: Date
  end_at: Date
  duration: number
  created_by: string
}
class Assessment
  extends Model<AssessmentAttributes>
  implements AssessmentAttributes {
  public id!: string
  public name!: string
  public description!: string
  public is_active!: boolean
  public start_at!: Date
  public end_at!: Date
  public duration!: number
  public created_by!: string
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
      allowNull: false
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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'assessment'
  }
)

export default Assessment
