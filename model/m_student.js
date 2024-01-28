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
        unique: true,
        allowNull:false
    },

    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    middle_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    name_extension: {
        type: DataTypes.STRING,
        allowNull: false,
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

    emergency_contact: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    student_num: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    friends: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue:[]
    },

    // program: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },

    // acad_year: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    // school_year: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    // is_regular: {
    //     type: DataTypes.BOOLEAN,
    //     allowNull: true,
    // },
    // current_year: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // }
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
    targetKey: "id",
    as:"user_student"
});



module.exports = {Student}