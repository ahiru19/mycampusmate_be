const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");
const {groupChat} = require("./m_group_chat")

const groupMember = sequelize.define("group_member", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    group_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    
}, { freezeTableName: true, timestamps: true });

// relation
User.hasMany(groupMember, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "user_group",
    onDelete: "CASCADE"
});

groupMember.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
    as:"group_user"
});

groupChat.hasMany(groupMember, {
    foreignKey: "group_id",
    sourceKey: "id",
    as: "group_to_member",
    onDelete: "CASCADE"
});

groupMember.belongsTo(groupChat, {
    foreignKey: "group_id",
    targetKey: "id",
    as:"member_to_group"
});


module.exports = {groupMember}