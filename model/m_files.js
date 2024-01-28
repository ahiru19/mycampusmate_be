const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {studentPost} = require("./m_post");

const studentFiles = sequelize.define("student_files", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    post_id: {
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
    file_rand_name:{
        type: DataTypes.STRING,
        allowNull: false,
    }
    
}, { freezeTableName: true, timestamps: true });

// relation
studentPost.hasOne(studentFiles, {
    foreignKey: "post_id",
    sourceKey: "id",
    as: "post_files",
    onDelete: "CASCADE"
});

studentFiles.belongsTo(studentPost, {
    foreignKey: "post_id",
    targetKey: "id"
});

module.exports = {studentFiles}