const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");
const {groupChat} = require("./m_group_chat");

const Messages = sequelize.define("messages", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    convo_id:{
        type:DataTypes.STRING,
        allowNull:false
    },

    from: {
        type: DataTypes.INTEGER.UNSIGNED,
        // unique: true,
        allowNull: true,
    },
    to: {
        type: DataTypes.INTEGER.UNSIGNED,
        // unique: true,
        allowNull: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    for_gc: {
        type: DataTypes.BOOLEAN,
        // unique: true,
        allowNull: false,
        defaultValue: false
    },
    gc_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        // unique: true,
        allowNull: true,
    }
    
}, { freezeTableName: true, timestamps: true });

// relation
User.hasMany(Messages, {
    foreignKey: "from",
    sourceKey: "id",
    as: "user_to_message_from",
    onDelete: "CASCADE"
});

Messages.belongsTo(User, {
    foreignKey: "from",
    targetKey: "id",
    as:"message_to_user_from"
});

User.hasMany(Messages, {
    foreignKey: "to",
    sourceKey: "id",
    as: "user_to_message_to",
    onDelete: "CASCADE"
});

Messages.belongsTo(User, {
    foreignKey: "to",
    targetKey: "id",
    as: "message_to_user_to"
});

// relation
groupChat.hasMany(Messages, {
    foreignKey: "gc_id",
    sourceKey: "id",
    as: "group_message",
    onDelete: "CASCADE"
});

Messages.belongsTo(groupChat, {
    foreignKey: "gc_id",
    targetKey: "id",
    as:"message_group"
});

module.exports = {Messages}