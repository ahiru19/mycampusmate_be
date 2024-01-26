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
    
    email: {
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
        type: DataTypes.INTEGER,
        //1 for admin
        //2 for student
        allowNull: false,
    },

    is_approved: {
        type: DataTypes.INTEGER,
        defaultValue: false,
    },

    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
    
}, { freezeTableName: true, timestamps:false});


module.exports = {User}