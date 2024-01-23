
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sign, verify } = require("jsonwebtoken");
const {User} = require("../model/m_user");
const {authToken} = require("../model/m_auth");

const register = async (req, res) => {
  let body = req.body;
  
  bcrypt.hash(body.password, 12).then( async (hash) => {
      body.password = hash;

      await User.create({ ...body })
      .then( async () => {

        result = {
          status: 200,
          message:"User Registered Successfuly",
        }

        res.json(result);
      })

      .catch( async (err) => {
        if (err) {
            res.status(400).json({ error: err });
        }
      });

});
  
};

const login = async (req, res) => {
  

  await User.findOne({where: {username: req.body.username, is_approved:1}}).then(async (user)=> {

    bcrypt.compare(req.body.password, user.password, async (err, result) => {
      if(result){

        const accessToken = sign(
          { username: req.body.username },
          "changeforjwtsecret"
        );

        let body = {};
        body.token = accessToken;
        body.user_id = user.id;

        await authToken.upsert({ ...body});
       
        result = {
          message:"Login Successfully",
          token: accessToken,
          data: {
            "first_name":user.first_name,
            "last_name":user.last_name,
            "middle_name":user.middle_name,
            "usertype":user.usertype,
          }
        }

        return res.send(result).status(200)

      }
      else {
        return res.send('Username or Password is incorrect');
      }
    })
  }
  ).catch(async (err) => {
    console.log(err)
    res.send('User not found or not yet approved');
  })
  
};

const logout = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  console.log(token);

  await authToken.destroy({where: {token}})
  .then( async ()=> {
    res.send('Logged out successfully').status(200);
  })
  .catch( async (err) => {
    res.send(err).status(500);
  })
  
};




  
module.exports = { login, register, logout };