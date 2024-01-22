const {authToken} = require("../model/m_auth")
const AuthToken = async (req, res, next) => {
    if(req.url === '/jwt/register' || req.url === '/jwt/login'){ //check if the url is for register or for log-in except it on the token
        next();
    }
    else{
        let token = req.headers.authorization 

        if(!token){ // check if there is a token
            res.send('No Token Found!').status(500)
        }else{
            token = token.split(" ")[1];
            let user = await authToken.findOne({where:{token}});
            
            if(!user){ //check if the token exist in the database
                res.send('Invalid Token!').status(500)
            }else {
                next();
            }
          
        }
        
       
    }
}

module.exports = {AuthToken};