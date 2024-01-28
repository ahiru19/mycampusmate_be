const student = require("../controller/c_student");

module.exports.routeStudent= [
    {
        path: "/student/getAllStudent/",
        method: "get",
        action: student.getStudents
    },
    {
        path: "/student/getOneStudent/",
        method: "get",
        action: student.getOneStudent
    },
    {
        path: "/student/update/",
        method: "put",
        action: student.updateStudent
    },
    {
        path: "/student/addFriend/",
        method: "put",
        action: student.addFriend
    },
    
    
]