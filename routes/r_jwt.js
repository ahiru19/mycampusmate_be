const jwt = require("../controller/c_jwt");
// const client = require("../controller/c_client");

module.exports.routeJWT = [
    {
        path: "/jwt/logout/",
        method: "get",
        action: jwt.logout
    },
    {
        path: "/jwt/login",
        method: "post",
        action: jwt.login
    },

    {
        path: "/jwt/register",
        method: "post",
        action: jwt.register
    },

    {
        path: "/jwt/getOne/",
        method: "get",
        action: jwt.getOneUser
    },

    {
        path: "/jwt/changePassword/",
        method: "put",
        action: jwt.changePass
    },

    // {
    //     path: "/client/update/",
    //     method: "put",
    //     action: client.updateClient
    // },

    // {
    //     path: "/client/delete/",
    //     method: "delete",
    //     action: client.deleteClient
    // }
]