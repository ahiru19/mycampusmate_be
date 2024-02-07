const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const {User} = require("./m_user");


const Friends = sequelize.define("friends", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },

    user_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    friend: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    status:{
        type: DataTypes.BOOLEAN,
        //0: pending confirmation request
        //1: accepted friend request
        allowNull: false,
        defaultValue: false
    }
  
}, { freezeTableName: true, timestamps: true });

// relation
User.hasMany(Friends, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "friends_to_user",
    onDelete: "CASCADE"
});

Friends.belongsTo(User, { 
    foreignKey: "user_id",
    targetKey: "id",
    as:"user_to_friends"
});

// relation
User.hasMany(Friends, {
    foreignKey: "friend",
    sourceKey: "id",
    as: "friends",
    onDelete: "CASCADE"
});

Friends.belongsTo(User, { 
    foreignKey: "friend",
    targetKey: "id",
    as:"user_friends"
});


module.exports = {Friends}
