const {routeJWT}  =  require('./routes/r_jwt');
// const {routeClient} = require("./routes/r_client");
const {routeAdmin} = require("./routes/r_admin");
module.exports.appRoutes = [
    ...routeJWT,
    // ...routeClient,
    ...routeAdmin
]