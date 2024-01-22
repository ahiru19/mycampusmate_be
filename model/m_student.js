const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");

const Student = sequelize.define("student", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    stud_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,

    },

    age: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },

    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },

    sex: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    contact_num: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    program: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { freezeTableName: true, timestamps: true });

module.exports = {Student}