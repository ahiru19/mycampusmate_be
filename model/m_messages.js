const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {Student} = require("./m_student");

const Messages = sequelize.define("messages", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    from: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
    },
    to: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, { freezeTableName: true, timestamps: true });

// relation
Student.hasOne(Messages, {
    foreignKey: "from",
    sourceKey: "id",
    as: "from",
    onDelete: "CASCADE"
});

Messages.belongsTo(Student, {
    foreignKey: "from",
    targetKey: "id"
});

Student.hasOne(Messages, {
    foreignKey: "to",
    sourceKey: "id",
    as: "to",
    onDelete: "CASCADE"
});

Messages.belongsTo(Student, {
    foreignKey: "to",
    targetKey: "id"
});

module.exports = {Messages}