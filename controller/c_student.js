const {Student} = require("../model/m_student");


const getStudents = async(req, res) => {
    let users = await Student.findAll({
        where: {usertype: 'student'},
        attributes:{exclude:['updatedAt']}
    });

    res.send(users);
}

const createOrUpdateStudent = async (req, res) => {
    req.body.user_id = req.query.id;
    await Student.upsert({ ...req.body})
    .then( async(user) => {
        res.send('Student created successfully').status(200)
        })
    .catch( async (err) => {
        res.send(err).status(500);
        })
    
   
};

const updateStudent = async(req, res) => {

    await Student.update(req.body, {where:{id:req.query.id}} ).then( async() => {

        res.send('Student updated successfully').status(200)
        }).catch( async (err) => {

            res.send(err).status(500);
        });
}

const deleteStudent = async(req, res) => {
    
    await Student.destroy({where: {id: req.query.id}}).then( async(client) => {
        if(client){
            res.send('Student deleted successfully').status(200)
        }else {
            res.send('Student not found').status(400)
        }
        
        }).catch( async (err) => {

            res.send(err).status(500);
        });

    
}

module.exports = { getStudents, createOrUpdateStudent, updateStudent, deleteStudent};