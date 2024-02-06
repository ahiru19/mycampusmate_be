const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {Student} = require("./m_student");
const {Admin} = require("./m_admin")
const {studentPost} = require("./m_post")

const Comments = sequelize.define("comments", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },

    admin_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    
    post_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // likes: {
    //     type: DataTypes.JSON,
    //     allowNull: true,
    //     defaultValue:[]
    // },
}, { freezeTableName: true, timestamps: true });

// relation
Student.hasMany(Comments, {
    foreignKey: "student_id",
    sourceKey: "id",
    as: "commentstudent",
    onDelete: "CASCADE"
});

Comments.belongsTo(Student, {
    foreignKey: "student_id",
    targetKey: "id",
    as: "studentcomments"
});

// relation
Admin.hasMany(Comments, {
    foreignKey: "admin_id",
    sourceKey: "id",
    as: "commentadmin",
    onDelete: "CASCADE"
});

Comments.belongsTo(Admin, {
    foreignKey: "admin_id",
    targetKey: "id",
    as: "admincomments"
});

// relation
studentPost.hasMany(Comments, {
    foreignKey: "post_id",
    sourceKey: "id",
    as: "comments_to_post",
    onDelete: "CASCADE"
});

Comments.belongsTo(studentPost, {
    foreignKey: "post_id",
    targetKey: "id",
    as: "post_to_comments"
});

module.exports = {Comments}