const post = require("../controller/c_post");

module.exports.routePost = [
    {
        path: "/post/get",
        method: "get",
        action: post.getPost
    },
    {
        path: "/post/getOne/",
        method: "get",
        action: post.getOnePost
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
    {
        path: "/post/likePost",
        method: "put",
        action: post.addLike
    },
    {
        path: "/post/reportPost",
        method: "put",
        action: post.reportPost
    },
    {
        path: "/post/getReportedPost",
        method: "get",
        action: post.getReportedPost
    },
    {
        path: "/post/approveReport",
        method: "put",
        action: post.approveReport
    },
]