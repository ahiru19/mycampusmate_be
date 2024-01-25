const student = require("../controller/c_student");

module.exports.routeStudent= [
    {
        path: "/student/getAllStudent/",
        method: "get",
        action: student.getStudents
    },
    {
        path: "/student/update/",
        method: "put",
        action: student.updateStudent
    },
]