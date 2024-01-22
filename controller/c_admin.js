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

const getStudents = async(req, res) => {
    let users = await User.findAll({
        where: {usertype: 'student'},
        attributes:{exclude:['updatedAt']}
    });

    res.send(users);
}


module.exports = { createStudent, getStudents };