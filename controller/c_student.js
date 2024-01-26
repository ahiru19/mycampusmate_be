const {Student} = require("../model/m_student");
const {studentProfile} = require("../model/m_student_profile");
const path = require("path");

const getStudents = async(req, res) => {
    let users = await Student.findAll({
        attributes:{exclude:['updatedAt']}
    });

    res.send(users);
}

const createStudent = async (req, res) => {
    req.body.user_id = req.query.id;
    await Student.create({ ...req.body})
    .then( async() => {
        res.send('Student created successfully').status(200)
        })
    .catch( async (err) => {
        res.send(err).status(500);
        return 0;
        })
    
   
};

const updateStudent = async(req, res) => {
    
    const d = new Date();
    const birthdate = new Date(req.body.birthdate);
    let curr_year = d.getFullYear();
    let birth_year = birthdate.getFullYear();

    req.body.age = parseInt(curr_year) - parseInt(birth_year); //get the age

    let curr_month = d.getMonth();
    let birth_month = birthdate.getMonth();

    if(birth_month > curr_month){
        req.body.age = req.body.age - 1;//if birth month does not come yet minus 1
    }
    let user_id = await Student.findOne({where:{user_id:req.query.id}, attributes:['id']});

    if(!user_id){
        res.status(404).send('No Student Found');
        return 0;
    }
    await Student.update(req.body, {where:{user_id:req.query.id}} ).then( async(user) => { 
       
        if(req.files){
            let body = req.body
            let file = req.files.file
            let ext_name = ['jpg','jpeg','png']
            body.student_id = user_id.id
            body.file_name = file.name
            body.file_path = `./public/profile/`
            if(ext_name.indexOf(path.extname(body.file_name)) === -1 ){
                res.status(400).send('Only accept jpeg, jpg and/or png');
                return 0;
            }
            body.file_rand_name =  require('crypto').randomBytes(12).toString('hex') + path.extname(body.file_name);
 
            await studentProfile.upsert({ ...body})
            .then( async(user)=> {
                await file.mv(`./public/profile/${body.file_rand_name}`);
            })
            }

            res.send('Student updated successfully').status(200)
        
        })
        .catch( async (err) => {

            res.send(err).status(500);
            return 0;
        });
}

const deleteStudent = async(req, res) => {
    
    await Student.destroy({where: {id: req.query.id}}).then( async(client) => {
        if(client){
            res.send('Student deleted successfully').status(200)
        }else {
            res.send('Student not found').status(400)
            return 0;
        }
        
        }).catch( async (err) => {

            res.send(err).status(500);
            return 0;
        });

    
}

module.exports = { getStudents, createStudent, updateStudent, deleteStudent};