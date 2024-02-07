const student = require("../controller/c_student");
const friends = require("../controller/c_friends")

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
        action: friends.sendFriendRequest
    },
    {
        path: "/student/viewRequests/",
        method: "get",
        action: friends.getFriends
    },
    {
        path: "/student/confirmRequest/",
        method: "put",
        action: friends.confirmFriendRequest
    },
    {
        path: "/student/rejectRequest/",
        method: "put",
        action: friends.rejectFriendRequest
    },
    
    
]