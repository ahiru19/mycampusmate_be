const bcrypt = require('bcrypt');
const {User} = require("../model/m_user");
const {Student} = require ("../model/m_student")
const {userProfile} = require("../model/m_user_profile")
const {Admin} = require("../model/m_admin")
const {getFileInfo, checkIfUserExist } = require("../helper/helper")

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
        attributes:['id','username','usertype', 'is_approved'],
        include:[
          {
            model: Student,
            attributes: ['id','first_name', 'last_name', 'middle_name','age','address','student_num'],
            include: [
              {
                model: userProfile,
                attributes: ['file_path', 'file_name', 'file_rand_name'],
                as: "student_profile"
              }
            ],
            as: "student"
        },
        ]
    });

    res.send(users);
}

const getOneStudent = async(req, res) => {

  let user = await Student.findOne({ 
    where: {user_id:req.query.id},
    include:[
      {
        model:userProfile,
        as:'student_profile',
        attributes: ['file_name', 'file_path', 'file_rand_name']
      }
    ]
  })
  .catch(async(err)=> {
    console.log(err);
    res.status(500).send('Something went wrong');
  })

  if(user.student_profile){
    user.student_profile.file_path = user.student_profile.file_path + user.student_profile.file_rand_name
  }

  res.send(user);
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
  let body = req.body;

  if(body.password){ // check if password is given or not
    body.password = await bcrypt.hash(body.password, 12)
  }else {
    delete body.password;
  }

  //update for the user
  await User.update(body, {where:{id:id}});

  let include = [
    {
      model: userProfile,
      attributes: ['file_path', 'file_rand_name', 'file_name'],
      as: "admin_profile"
    },
    {
      model: User,
      attributes: ['email', 'username'],
      as: "user_admin"
    }
  ];
  let admin_user = await checkIfUserExist(Admin, {user_id:id}, include);

  if(!admin_user){
      res.status(404).send('No Admin Found');
      return 0;
  }
    console.log(admin_user);
  

  //update for the admin
  await Admin.update(body, {where:{user_id:id}})
   .catch( async(err) => {
    console.log(err)
    res.status(500).send('Something went wrong!')
    return 0;
  })

  if(req.files) {
    let file_info = await getFileInfo(req.files.file, 'profile')
    file_info.admin_id = admin_user.id
    await userProfile.upsert({...file_info});
    await req.files.file.mv(`./public/profile/${file_info.file_rand_name}`);

  }

  admin_user = await checkIfUserExist(Admin, {user_id:id}, include);

  if(admin_user.admin_profile){
    admin_user.admin_profile.file_path = admin_user.admin_profile.file_path + admin_user.admin_profile.file_rand_name;
  }
  res.status(200).send(admin_user);

}

module.exports = { createStudent, getStudents, approveStudent, rejectStudent, countStudents, updateAdmin, getOneStudent};