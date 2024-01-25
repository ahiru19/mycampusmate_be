const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");

const Admin = sequelize.define("admin", {

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

    position: {
        type: DataTypes.STRING,
        allowNull: true,
    },

        
}, { freezeTableName: true, timestamps: true });


// relation
User.hasOne(Admin, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "admin",
    onDelete: "CASCADE"
});

Admin.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id"
});


module.exports = {Admin}