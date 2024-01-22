const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");

const Student = sequelize.define("student", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    user_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
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

// relation
User.hasOne(Student, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "student",
    onDelete: "CASCADE"
});

Student.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id"
});



module.exports = {Student}