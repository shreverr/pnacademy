import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';
import User from '../user/user.schema';


const Assessment = sequelize.define('assessment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    startAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
});

Assessment.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = Assessment;