const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {Student} = require("./m_student");
const {Admin} = require("./m_admin");
const {User} = require ("./m_user");

const studentPost = sequelize.define("posts", {

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
    },
    likes: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        // defaultValue:"[]",
        // get() {

        //     if(this.getDataValue('likes') != "[]" || this.getDataValue('likes') != ""){
        //         const rawValue = JSON.parse(this.getDataValue('likes'));
        //         return rawValue.length;
        //     }
        //     else{
        //         return this.getDataValue('likes');
        //     }
            
        // }
    },

    is_reported: {
        type: DataTypes.INTEGER,
        //0 - not reported
        //1 - reported but pending for admin validation
        //2 - reported and approved deleted by admin
        allowNull: true,
        defaultValue:0,
    },
    reporter_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },

    reason_for_report: {
        type: DataTypes.STRING,
        allowNull: true,
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

User.hasMany(studentPost, {
    foreignKey: "reporter_id",
    sourceKey: "id",
    as: "user_to_report",
    onDelete: "CASCADE"
});

studentPost.belongsTo(User, {
    foreignKey: "reporter_id",
    targetKey: "id",
    as: "report_to_user"
});


// relation
Admin.hasMany(studentPost, {
    foreignKey: "admin_id",
    sourceKey: "id",
    as: "postadmin",
    onDelete: "CASCADE"
});

studentPost.belongsTo(Admin, {
    foreignKey: "admin_id",
    targetKey: "id",
    as: "adminpost"
});

module.exports = {studentPost}