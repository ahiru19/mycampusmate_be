const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");

const User = sequelize.define("users", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    middle_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    usertype: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
    
}, { freezeTableName: true, timestamps:false});

module.exports = {User}