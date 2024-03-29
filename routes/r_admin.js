const admin = require("../controller/c_admin");

module.exports.routeAdmin= [
    {
        path: "/admin/createStudent/",
        method: "post",
        action: admin.createStudent
    },
    {
        path: "/admin/getAllUser/",
        method: "get",
        action: admin.getAllUsers
    },
    {
        path: "/admin/getUser/",
        method: "get",
        action: admin.getOneUser
    },
    {
        path: "/admin/getAllStudent/",
        method: "get",
        action: admin.getStudents
    },
    {
        path: "/admin/getOneStudent/",
        method: "get",
        action: admin.getOneStudent
    },
    {
        path: "/admin/approveStudent/",
        method: "put",
        action: admin.approveStudent
    },
    
    {
        path: "/admin/rejectStudent/",
        method: "delete",
        action: admin.rejectStudent
    },
    {
        path: "/admin/countAll/",
        method: "get",
        action: admin.countStudents
    },
    {
        path: "/admin/update/",
        method: "put",
        action: admin.updateAdmin
    },

]