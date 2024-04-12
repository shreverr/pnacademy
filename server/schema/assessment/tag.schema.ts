import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';


const Tag = sequelize.define('tag', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});
export default Tag;