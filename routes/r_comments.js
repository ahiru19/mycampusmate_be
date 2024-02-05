const comments = require("../controller/c_comments");

module.exports.routeComments = [
    {
        path: "/comments/addComment/",
        method: "post",
        action: comments.addComments
    },
    // {
    //     path: "/comments/getAll/",
    //     method: "get",
    //     action: comments.getClient
    // },
    // {
    //     path: "/comments/getAll/",
    //     method: "get",
    //     action: comments.getClient
    // },
]
