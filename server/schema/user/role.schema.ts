import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

const Role = sequelize.define('role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    },
  });
  
export default Role;