import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export interface RoleAttributes {
  id: string
  name: string
  canManageAssessment: boolean
  canManageUser: boolean
  canManageRole: boolean
  canManageNotification: boolean
  canManageLocalGroup: boolean
  canAttemptAssessment: boolean
  canViewReport: boolean
  canManageMyAccount: boolean
  canViewNotification: boolean
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id!: string
  public name!: string
  public canManageAssessment!: boolean
  public canManageUser!: boolean
  public canManageRole!: boolean
  public canManageNotification!: boolean
  public canManageLocalGroup!: boolean
  public canAttemptAssessment!: boolean
  public canViewReport!: boolean
  public canManageMyAccount!: boolean
  public canViewNotification!: boolean
}
Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    canManageAssessment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canManageUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canManageRole: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canManageNotification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canManageLocalGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canAttemptAssessment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canViewReport: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canManageMyAccount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canViewNotification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'role'
  }
)

export default Role
