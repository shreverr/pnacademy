import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../config/database'

export interface TestCaseAttributes {
  id: string
  question_id: string
  is_sample: boolean
  input: string
  output: string
  explanation: string
}

class TestCase extends Model<TestCaseAttributes> implements TestCaseAttributes {
  public id!: string
  public question_id!: string
  public is_sample!: boolean
  public input!: string
  public output!: string
  public explanation!: string
}

TestCase.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_sample: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    output: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'test_case'
  }
)

export default TestCase
