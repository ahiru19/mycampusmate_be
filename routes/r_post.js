const post = require("../controller/c_post");

module.exports.routePost = [
    {
        path: "/post/get",
        method: "get",
        action: post.getPost
    },
    {
        path: "/post/create",
        method: "post",
        action: post.createPost
    },
    {
        path: "/post/delete",
        method: "put",
        action: post.deletePost
    },
]