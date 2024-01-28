const post = require("../controller/c_post");

module.exports.routePost = [
    {
        path: "/post/create",
        method: "post",
        action: post.createPost
    },
]