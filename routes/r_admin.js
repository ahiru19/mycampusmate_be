const admin = require("../controller/c_admin");
const student = require("../controller/c_student");

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