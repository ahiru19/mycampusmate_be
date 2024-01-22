const student = require("../controller/c_student");

module.exports.routeAdmin= [
    {
        path: "/student/getAllStudent/",
        method: "get",
        action: student.getStudents
    },
    {
        path: "/student/updateStudent/",
        method: "put",
        action: student.updateStudent
    },
]