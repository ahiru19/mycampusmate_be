const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {Student} = require("./m_student");
const {Admin} = require('./m_admin')

const userProfile = sequelize.define("user_profile", {

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
        allowNull: true,
    },
    admin_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: true,
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
Student.hasOne(userProfile, {
    foreignKey: "student_id",
    sourceKey: "id",
    as: "student_profile",
    onDelete: "CASCADE"
});

userProfile.belongsTo(Student, {
    foreignKey: "student_id",
    targetKey: "id"
});

// relation
Admin.hasOne(userProfile, {
    foreignKey: "admin_id",
    sourceKey: "id",
    as: "admin_profile",
    onDelete: "CASCADE"
});

userProfile.belongsTo(Admin, {
    foreignKey: "admin_id",
    targetKey: "id"
});

module.exports = {userProfile}