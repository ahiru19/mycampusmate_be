const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {Student} = require("./m_student");

const studentPost = sequelize.define("student_post", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },

    post_description: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    visibility: {
        type: DataTypes.INTEGER,
        //1 for everyone
        //2 for friends only
        //3 for only me
        allowNull: false,
    }
}, { freezeTableName: true, timestamps: true });

// relation
Student.hasMany(studentPost, {
    foreignKey: "student_id",
    sourceKey: "id",
    as: "poststudent",
    onDelete: "CASCADE"
});

studentPost.belongsTo(Student, {
    foreignKey: "student_id",
    targetKey: "id",
    as: "studentpost"
});

module.exports = {studentPost}