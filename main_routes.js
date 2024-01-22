const {routeJWT}  =  require('./routes/r_jwt');
const {routeStudent} = require("./routes/r_student");
const {routeAdmin} = require("./routes/r_admin");
module.exports.appRoutes = [
    ...routeJWT,
    ...routeStudent,
    ...routeAdmin
]