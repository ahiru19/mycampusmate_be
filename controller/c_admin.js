const bcrypt = require('bcrypt');
const {User} = require("../model/m_user");

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
      res.send('No ID found!');
      return 0;
    });

  if(!user){ // check if there is a student
    res.send('Student not found!');
    return 0;
  }
  if(user && user.is_approved == true){ //check if student is already approved
    res.send('Student is already approved!');
    return 0;
  }

  User.update({is_approved:true}, {where : {id: req.query.id} } )
  .then ( (user)=>{
    return res.send("Approved Successfully").status(200)
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
    return res.send("Student is now rejected").status(200)
  })
  .catch(async (err) => {
    res.send('Something went wrong!');
    return 0;
  })
 
}

const getStudents = async(req, res) => {
    let users = await User.findAll({
        where: {usertype: 'student'},
        attributes:{exclude:['updatedAt']}
    });

    res.send(users);
}


module.exports = { createStudent, getStudents, approveStudent, rejectStudent };