const messages = require("../controller/c_messages");

module.exports.routeMessages = [
    {
        path: "/messages/getMessages/",
        method: "get",
        action: messages.getMessages
    },
    {
        path: "/messages/getOneMessages/",
        method: "get",
        action: messages.getOneMessages
    },

    {
        path: "/messages/sendMessages/",
        method: "post",
        action: messages.addMessages
    },

    {
        path: "/messages/deleteMessages/",
        method: "put",
        action: messages.deleteMessages
    },
]