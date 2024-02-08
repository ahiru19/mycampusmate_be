const messages = require("../controller/c_messages");
const group_chat = require("../controller/c_group_chat");

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

    {
        path: "/messages/createGroup/",
        method: "post",
        action: group_chat.createGroupChat
    },

    {
        path: "/messages/groupMessage/",
        method: "post",
        action: group_chat.addMessage
    },
    {
        path: "/messages/addMember/",
        method: "post",
        action: group_chat.addMember
    },

    {
        path: "/messages/groupMessage/",
        method: "get",
        action: group_chat.getMessages
    },
    {
        path: "/messages/groupChats/",
        method: "get",
        action: group_chat.getGroupChat
    },
]