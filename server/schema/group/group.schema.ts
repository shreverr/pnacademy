import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database";

const Group = sequelize.define("group", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
export default Group;
