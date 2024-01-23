const admin = require("../controller/c_admin");

module.exports.routeAdmin= [
    {
        path: "/admin/createStudent/",
        method: "post",
        action: admin.createStudent
    },
    {
        path: "/admin/getAllStudent/",
        method: "get",
        action: admin.getStudents
    },
    {
        path: "/admin/approveStudent/",
        method: "put",
        action: admin.approveStudent
    },
]