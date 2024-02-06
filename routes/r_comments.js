const comments = require("../controller/c_comments");

module.exports.routeComments = [
    {
        path: "/comments/addComment/",
        method: "post",
        action: comments.addComments
    },
    {
        path: "/comments/delete/",
        method: "put",
        action: comments.deleteComment
    },
    // {
    //     path: "/comments/getAll/",
    //     method: "get",
    //     action: comments.getClient
    // },
]
