const student = require("../controller/c_student");

module.exports.routeAdmin= [
    {
        path: "/admin/getAllStudent/",
        method: "get",
        action: student.getStudents
    },
    {
        path: "/admin/updateStudent/",
        method: "put",
        action: student.updateStudent
    },
]