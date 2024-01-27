
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sign, verify } = require("jsonwebtoken");
const {User} = require("../model/m_user");
const {Student} = require("../model/m_student");
const {Admin} = require("../model/m_admin");
const {userProfile} = require("../model/m_user_profile");
const {authToken} = require("../model/m_auth");
const {getFileInfo, calculateAge} = require("../helper/helper");
const path = require("path");

const register = async (req, res) => {
  let body = req.body;

  body.age = await calculateAge(body.birth_date);
  
  bcrypt.hash(body.password, 12).then( async (hash) => {
      body.password = hash;


      let if_exist = await User.findOne({where:{username:body.username}});
      
      if(if_exist){
        res.status(400).send('Username is already taken!');
        return 0;
      }

      await User.create({ ...body })
      .then( async (user) => {
        
        body.user_id = user.id;

        if(body.usertype == 1){
          await Admin.create({ ...body})
        }
        else{
          await Student.create({ ...body})
          .then( async(student)=> {
            if(req.files){
              let body = req.body

              let ext_name = ['.jpg','.jpeg','.png']

              let file_info = await getFileInfo(req.files.file, 'profile')

              if(ext_name.indexOf(path.extname(file_info.file_name).toLowerCase()) === -1 ){
                res.status(400).send('Only accept jpeg, jpg and/or png');
                return 0;
              }

              file_info.student_id = student.id

              await userProfile.create({ ...file_info}) 
              .then( async(user)=> {
                  await req.files.file.mv(`./public/profile/${file_info.file_rand_name}`);
              })
              .catch( async (err) => {
                    console.log(err)
                    res.status(400).send({ error: err });
              });
            }

          })
        }

        result = {
          status: 200,
          message:"User Registered Successfuly",
        }

        res.send(result);
      })

      .catch( async (err) => {
        console.log(err)
        if (err) {
            res.status(400).send({ error: err });
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
            "user_id":user.id,
            "first_name":user.first_name,
            "last_name":user.last_name,
            "middle_name":user.middle_name,
            "usertype":user.usertype,
          }
        }
        return res.status(200).send(result)

      }
      else {
        return res.status(401).send('Username or Password is incorrect');
      }
    })
  }
  ).catch(async (err) => {
    console.log(err)
    res.status(400).send('User not found or not yet approved');
  })
  
};

const logout = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  console.log(token);

  await authToken.destroy({where: {token}})
  .then( async ()=> {
    res.status(200).send('Logged out successfully');
  })
  .catch( async (err) => {
    res.status(500).send(err);
  })
  
};

const getOneUser = async(req, res) => {
  let id = req.user_info.id;
  let usertype = req.user_info.usertype

  if(usertype == 1){
    await Admin.findOne({
      where:{user_id:id},
      include: [
        {
            model: userProfile,
            attributes: ['file_path', 'file_rand_name', 'file_name'],
            as: "admin_profile"
        },
        {
          model: User,
          attributes: ['email', 'username'],
          as: "user_admin"
      },
    ]
  })
    .then( async (user)=>{
      let id = user.user_id

      if(user.admin_profile){
        user.admin_profile.file_path = user.admin_profile.file_path + '/' + user.admin_profile.file_rand_name;
      }
        res.status(200).send(user)
    })
    .catch( (err) => {
      console.log(err)
      res.status(500).send(err)
      return 0;
    })
  }
  else if(usertype == 2) {
    await Student.findOne({
      where:{user_id:id},
      include: [
        {
            model: userProfile,
            attributes: ['file_path', 'file_rand_name', 'file_name'],
            as: "student_profile"
        },
        {
          model: User,
          attributes: ['email', 'username'],
          as: "user_student"
      },
    ]
    
    })
    .then( async (user)=>{
        let id = user.user_id
        let user_acc = await User.findOne({ where: {id:id}});
        user.email = user_acc.email
        user.username = user_acc.username

        if(user.student_profile){
          user.student_profile.file_path = user.student_profile.file_path + '/' + user.student_profile.file_rand_name;
        }
        res.status(200).send(user)
    })
    .catch( (err) => {
      console.log(err)
      res.status(500).send(err)
      return 0;
    })
  }
  else {
    res.status(404).send('Usertype not found!')
  }
}


  
module.exports = { login, register, logout, getOneUser };