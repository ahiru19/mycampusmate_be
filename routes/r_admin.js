const admin = require("../controller/c_admin");

module.exports.routeAdmin= [
    {
        path: "/admin/createStudent/",
        method: "post",
        action: admin.createStudent
    },
    {
        path: "/admin/getAllStrudent/",
        method: "get",
        action: student.getStudents
    },
]