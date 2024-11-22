import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

export interface GroupAssessmentResultAttributes {
  id: string;
  assessment_id: string;
  group_id: string;
  total_marks: number;
  total_participants: number;
  average_marks: number;
  average_marks_percentage: number;
  created_at?: Date;
  updated_at?: Date;
}

class GroupAssessmentResult
  extends Model<GroupAssessmentResultAttributes>
  implements GroupAssessmentResultAttributes {
  public id!: string;
  public assessment_id!: string;
  public group_id!: string;
  public total_marks!: number;
  public total_participants!: number;
  public average_marks!: number;
  public average_marks_percentage!: number;
  public is_published!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

GroupAssessmentResult.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    assessment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false
    },
    group_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false
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
    }
  },
  {
    sequelize,
    modelName: 'group_assessment_result',
    timestamps: true,
  }
);

export default GroupAssessmentResult;
