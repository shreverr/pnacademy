import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

export interface AssessmentAttributes {
  id: string;
  name: string;
  imageKey?: string;
  description?: string;
  isActive: boolean;
  startAt: Date;
  endAt: Date;
  duration: number;
  isPublished: boolean;
  totalMarks?: number;
  search_vector?: any; // tsvector type
  createdAt?: Date;
  updatedAt?: Date;
}

class Assessment extends Model<AssessmentAttributes> implements AssessmentAttributes {
  public id!: string;
  public name!: string;
  public imageKey?: string;
  public description?: string;
  public isActive!: boolean;
  public startAt!: Date;
  public endAt!: Date;
  public duration!: number;
  public isPublished!: boolean;
  public totalMarks?: number;
  public search_vector?: any; // tsvector type
  public createdAt?: Date;
  public updatedAt?: Date;
}

Assessment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Ensure your database supports this type
      allowNull: false,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    search_vector: {
      type: DataTypes.TSVECTOR,
      allowNull: true,
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
    modelName: 'assessment',
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);


Assessment.addHook('beforeFind', (options) => {
  options.attributes = { exclude: ['search_vector'] };
});

Assessment.addHook('afterCreate', (instance) => {
  if (instance && instance.dataValues) {
    delete instance.dataValues.search_vector;
  }
});

export default Assessment;
