const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {Student} = require("./m_student");

const studentProfile = sequelize.define("student_profile", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
    },

    file_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_rand_name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
    
}, { freezeTableName: true, timestamps: true });

// relation
Student.hasOne(studentProfile, {
    foreignKey: "student_id",
    sourceKey: "id",
    as: "student_profile",
    onDelete: "CASCADE"
});

studentProfile.belongsTo(Student, {
    foreignKey: "student_id",
    targetKey: "id"
});

module.exports = {studentProfile}