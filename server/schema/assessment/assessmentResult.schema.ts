import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

export interface AssessmentResultAttributes {
  id: string;
  assessment_id: string;
  total_marks: number;
  total_participants: number;
  average_marks: number;
  average_marks_percentage: number;
  is_published: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class AssessmentResult
  extends Model<AssessmentResultAttributes>
  implements AssessmentResultAttributes {
  public id!: string;
  public assessment_id!: string;
  public total_marks!: number;
  public total_participants!: number;
  public average_marks!: number;
  public average_marks_percentage!: number;
  public is_published!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

AssessmentResult.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    assessment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    total_marks: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total_participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    average_marks: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    average_marks_percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'assessment_result',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AssessmentResult;
