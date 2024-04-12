import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';



const Assessment = sequelize.define('assessment', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    start_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
    },
});



export default Assessment;