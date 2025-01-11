import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import Assessment from './assessment.schema';

export interface ProctoringOptionsAttributes {
  id: string;
  assessmentId: string;
  basic: boolean;
  ai: boolean;
  aiWithHuman: boolean;
  allowedDevices: string[];
  maxAllowedWarnings: number;
  autoKickOut: boolean;
  awardZeroMarksOnKickout: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class ProctoringOptions extends Model<ProctoringOptionsAttributes> implements ProctoringOptionsAttributes {
  public id!: string;
  public assessmentId!: string;
  public basic!: boolean;
  public ai!: boolean;
  public aiWithHuman!: boolean;
  public allowedDevices!: string[];
  public maxAllowedWarnings!: number;
  public autoKickOut!: boolean;
  public awardZeroMarksOnKickout!: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}

ProctoringOptions.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    assessmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    basic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ai: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    aiWithHuman: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    allowedDevices: {
      type: DataTypes.ARRAY(DataTypes.ENUM('WEB', 'MOBILE')),
      allowNull: false,
      defaultValue: ['WEB']
    },
    maxAllowedWarnings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    autoKickOut: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    awardZeroMarksOnKickout: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'proctoring_options',
    timestamps: true,
  }
);

export default ProctoringOptions;
