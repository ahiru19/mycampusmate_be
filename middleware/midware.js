const {authToken} = require("../model/m_auth")
const {User} = require("../model/m_user")
const AuthToken = async (req, res, next) => {
        if(!req.headers.authorization){ // check if there is a token
            res.send('No Token Found!').status(500)
        }
        else{
            let token = req.headers.authorization.split(" ")[1];
            await authToken.findOne({where:{token}})
            .then( async (user)=> {
                user_id = user.user_id
                let user_info = await User.findOne({
                    where:{id:user_id},
                    attributes:['id','usertype']
                })
                req.user_info = user_info
                next();
            })
            .catch( async(err) => {
                console.log(err)
                res.status(400).send('Token not found!')
            })
          
        }
}

module.exports = {AuthToken};