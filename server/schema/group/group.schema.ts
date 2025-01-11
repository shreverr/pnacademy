import { DataTypes, Model, Sequelize } from 'sequelize'
import { sequelize } from '../../config/database'

interface GroupAttributes {
  id: string
  name: string
  search_vector: any; // tsvector type
}
class Group extends Model<GroupAttributes> implements GroupAttributes {
  public id!: string
  public name!: string
  public search_vector: any; // tsvector type
}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    search_vector: {
      type: DataTypes.TSVECTOR,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'group'
  }
)

Group.addHook('beforeFind', (options) => {
  options.attributes = { exclude: ['search_vector'] };
});

Group.addHook('afterCreate', (instance) => {
  if (instance && instance.dataValues) {
    delete instance.dataValues.search_vector;
  }
});

export default Group
