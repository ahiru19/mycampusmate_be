
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
  let body = req.body;

  let user = await User.findOne({where: {username: body.username}});
  if(user){
      bcrypt.compare(body.password, user.password, async (err, result) => {
        if(result){

          const accessToken = sign(
            { username: req.body.username },
            "changeforjwtsecret"
          );

          body.token = accessToken;
          body.user_id = user.id;
          await authToken.create({...body})

          result = {
            message:"Login Successfully",
            token: accessToken
          }

          res.send(result).status(200)

        }
        else {
            res.send('Username or Password is incorrect').status(401)
        }
      })
  }
  else {
    res.send('Username not Found').status(404)
  }
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