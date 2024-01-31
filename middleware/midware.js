const {authToken} = require("../model/m_auth")
const {User} = require("../model/m_user")
const AuthToken = async (req, res, next) => {
        // let route_exclude = ['/jwt/login/', '/jwt/register/'];

        // if(route_exclude.includes(req.url)){
            next();
        // }
        // else if(!req.headers.authorization){ // check if there is a token
        //     res.status(500).send('No Token Found!')
        //     return 0;
        // }
        // else{
        //     let token = req.headers.authorization.split(" ")[1];
        //     await authToken.findOne({where:{token}})
        //     .then( async (user)=> {
        //         user_id = user.user_id
        //         let user_info = await User.findOne({
        //             where:{id:user_id},
        //             attributes:['id','username','email','usertype']
        //         })
        //         req.user_info = user_info
        //         next();
        //     })
        //     .catch( async(err) => {
        //         console.log(err)
        //         res.status(400).send('Token not found!')
        //     })
          
        // }
}

module.exports = {AuthToken};