const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");

const groupChat = sequelize.define("group_chat", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    group_admin: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, { freezeTableName: true, timestamps: true });

// relation
User.hasMany(groupChat, {
    foreignKey: "group_admin",
    sourceKey: "id",
    as: "group_chat",
    onDelete: "CASCADE"
});

groupChat.belongsTo(User, {
    foreignKey: "group_admin",
    targetKey: "id",
    as:"chat_group"
});


module.exports = {groupChat}