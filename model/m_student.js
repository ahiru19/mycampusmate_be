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
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,

    },

    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },

    sex: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    contact_num: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    program: {
        type: DataTypes.STRING,
        allowNull: true,
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