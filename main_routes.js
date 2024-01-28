const {routeJWT}  =  require('./routes/r_jwt');
const {routeStudent} = require("./routes/r_student");
const {routeAdmin} = require("./routes/r_admin");
const {routePost} = require("./routes/r_post");
const {routeMessages} = require("./routes/r_messages")
module.exports.appRoutes = [
    ...routeJWT,
    ...routeStudent,
    ...routeAdmin,
    ...routePost,
    ...routeMessages
]