const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");
const authToken = sequelize.define("tokens", {

    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        unique: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
}, { freezeTableName: true, timestamps: true });

// relation
User.hasOne(authToken, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "user",
    onDelete: "CASCADE"
});

authToken.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id"
});

module.exports = {authToken}