const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");

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
        allowNull: false,
    },
    to: {
        type: DataTypes.INTEGER.UNSIGNED,
        // unique: true,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
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

module.exports = {Messages}