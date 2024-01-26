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

    user_id: {
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
Student.hasOne(userProfile, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "student_profile",
    onDelete: "CASCADE"
});

userProfile.belongsTo(Student, {
    foreignKey: "user_id",
    targetKey: "id"
});

// relation
Admin.hasOne(userProfile, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "admin_profile",
    onDelete: "CASCADE"
});

userProfile.belongsTo(Admin, {
    foreignKey: "user_id",
    targetKey: "id"
});

module.exports = {userProfile}