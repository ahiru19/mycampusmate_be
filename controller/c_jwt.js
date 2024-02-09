
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

  body.age = await calculateAge(body.birth_date);//Calculate the age of the student
  
  bcrypt.hash(body.password, 12).then( async (hash) => {
      body.password = hash;

      let if_exist = await User.findOne({where:{username:body.username}});
      
      if(if_exist){ // check if exist
        res.status(400).send('Username is already taken!');
        return 0;
      }
      else {

        let ext_name = ['.jpg','.jpeg','.png']

        let file_info = await getFileInfo(req.files.file, 'profile')

        if(ext_name.indexOf(path.extname(file_info.file_name).toLowerCase()) === -1 ){//check for the file extension
            res.status(400).send('Only accept jpeg, jpg and/or png');
            return 0;
          }

          if(!req.files.file){
            console.log('no files');
            res.status(400).send('Kindly Upload an image');
            return 0;
          }

          await req.files.file.mv(`./public/profile/${file_info.file_rand_name}`)
          .then( async()=> {
            await User.create({ ...body }) //create the user
            .then( async (user) => { 
              body.user_id = user.id;

              if(body.usertype == 1){//check if admin or student
                await Admin.create({ ...body})
              }

              else{
                await Student.create({ ...body})
              }

              await userProfile.create({ ...file_info}) //save the user profile

            })
            res.send('Registered Successfuly')

          })
          .catch( (err) => {
            console.log(err);
            res.status(500).send('Something went wrong');
            return 0;
          })
      
        }
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

const changePass = async(req, res) => {
  await User.findOne({where: {username: req.body.username, is_approved:1}}).then(async (user)=> {

    bcrypt.compare(req.body.old_password, user.password, async (err, result) => {
      if(result){

        user.password = await bcrypt.hash(req.body.new_password, 12);
        user.save();
        return res.status(200).send('Password change successfuly');
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
}

const changeProfile = async (req, res) => {
  if(req.files){ // check if there is a file and get the file id

    let ext_name = ['.jpg','.jpeg','.png']

    let file_info = await getFileInfo(req.files.file, 'profile')

    if(ext_name.indexOf(path.extname(file_info.file_name).toLowerCase()) === -1 ){//check for the file extension
        res.status(400).send('Only accept jpeg, jpg and/or png');
        return 0;
    }

     let profile_id = 0 
     let user =  await User.findOne({
      where:{id:req.user_info.id},
      include:[
        {
          model: Student,
          attributes: ['id'],
          include: [
            {
              model: userProfile,
              attributes: ['id'],
              as: "student_profile"
            }
          ],
          as: "student"
      },
      {
        model: Admin,
        attributes: ['id'],
        include: [
          {
            model: userProfile,
            attributes: ['id'],
            as: "admin_profile"
          }
        ],
        as: "admin"
    },
      ]
    })

    if(user.student){
      profile_id = user.student.student_profile
      console.log(profile_id)
    }
    else if(user.admin){
      profile_id = user.admin.admin_profile.id
      console.log(profile_id)
    }

   

    let profile_info = await getFileInfo(req.files.file, 'profile'); // get profile details

    await req.files.file.mv(`./public/profile/${profile_info.file_rand_name}`); // save the new profile

     await userProfile.findOne({ where: {id: profile_id}}) // get the userprofile to update it
    .then( async (profile) => {
      console.log(profile);
      profile.file_name = profile_info.file_name;
      profile.file_rand_name = profile_info.file_rand_name;
      profile.save();

      res.send('Profile changed successfuly');
    })
    .catch ( async (err)=>{
      console.log(err);
      res.status(400).send('Something went wrong');
      return 0;
    })
  

    
  }
  else {
    res.status(400).send('No file found');
  }
  
 

}


  
module.exports = { login, register, logout, getOneUser, changePass, changeProfile };