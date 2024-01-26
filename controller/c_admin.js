const bcrypt = require('bcrypt');
const {User} = require("../model/m_user");
const {Student} = require ("../model/m_student")
const {userProfile} = require("../model/m_user_profile")
const {Admin} = require("../model/m_admin")
const {getFileInfo} = require("../helper/helper")

const createStudent = async (req, res) => {
    let body = req.body;
    
    bcrypt.hash(body.password, 12).then( async (hash) => {
        body.password = hash;
        body.is_approved = true;
        await User.create({ ...body })
        .then( async () => {
  
          result = {
            status: 200,
            message:"Student Registered Successfuly",
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

const approveStudent = async (req, res) => {

  let user = await User.findOne({where:{id:req.query.id}})
  .catch(
    (err) => {
      res.status(404).send('No ID found!');
      return 0;
    });

  if(!user){ // check if there is a student
    res.status(404).send('Student not found!');
    return 0;
  }
  if(user && user.is_approved == true){ //check if student is already approved
    res.send('Student is already approved!');
    return 0;
  }

  User.update({is_approved:true}, {where : {id: req.query.id} } )
  .then ( (user)=>{
    return res.status(200).send("Approved Successfully")
  })
  .catch(async (err) => {
    console.log(err)
    res.send('Something went wrong!');
    return 0;
  })
  
}

const rejectStudent = async (req, res) => {
  let user = await User.findOne({where:{id:req.query.id}})
  .catch(
    (err) => {
      res.send('No ID found!');
      return 0;
    });

  if(!user){ // check if there is a student
    res.send('Student not found!');
    return 0;
  }
  if(user && user.is_approved == 2){ //check if student is already approved
    res.send('Student is already rejected!');
    return 0;
  }

  User.update({is_approved:2}, {where : {id: req.query.id} } )
  .then ( (user)=>{
    return res.status(200).send("Student is now rejected")
  })
  .catch(async (err) => {
    res.status(400).send('Something went wrong!');
    return 0;
  })
 
}

const getStudents = async(req, res) => {
    let users = await User.findAll({
        where: {usertype: 2},
        attributes:['id','username','usertype'],
        include:[
          {
            model: Student,
            attributes: ['first_name', 'last_name', 'middle_name'],
            as: "student"
        },
        ]
    });

    res.send(users);
}

const countStudents = async(req, res) => {

  let user_pending = await User.count({ where: {is_approved: 0}});
  let user_approved = await User.count({ where: {is_approved: 1}});
  let user_rejected = await User.count({ where: {is_approved: 2}});

  let data = {
    'pending': user_pending,
    'approved': user_approved,
    'rejected': user_rejected
  }

  res.status(200).send(data);
  
}

const updateAdmin = async(req, res) => {
  let id = req.user_info.id;

  await Admin.update(req.body, {where:{id}})
  .then( async () => {
      if(req.files) {
        let file_info = await getFileInfo(req.files.file, 'profile')
        file_info.user_id = id

        await userProfile.create({...file_info})
        .then( async()=> {
          await files.file.mv(`./public/profile/${file_info.file_rand_name}`);
        })
        .catch( async(err) => {
          console.log(err)
          res.status(500).send('Something went wrong!')
        })

        res.status(200).send('Update Successful');
      }

  })
  .catch( async(err) => {
    console.log(err)
    res.status(500).send('Something went wrong!')
  })
}


module.exports = { createStudent, getStudents, approveStudent, rejectStudent, countStudents, updateAdmin};