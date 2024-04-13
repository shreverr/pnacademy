import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

interface RoleAttributes {
  id: string
  name: string
  can_manage_assessment: boolean
  can_manage_user: boolean
  can_manage_role: boolean
  can_manage_notification: boolean
  can_manage_local_group: boolean
  can_attempt_assessment: boolean
  can_view_report: boolean
  can_manage_my_account: boolean
  can_view_notification: boolean
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id!: string
  public name!: string
  public can_manage_assessment!: boolean
  public can_manage_user!: boolean
  public can_manage_role!: boolean
  public can_manage_notification!: boolean
  public can_manage_local_group!: boolean
  public can_attempt_assessment!: boolean
  public can_view_report!: boolean
  public can_manage_my_account!: boolean
  public can_view_notification!: boolean
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
    can_manage_assessment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_manage_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_manage_role: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_manage_notification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_manage_local_group: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_attempt_assessment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_view_report: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_manage_my_account: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    can_view_notification: {
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
