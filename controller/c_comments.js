const {Comments} = require("../model/m_comments");
const {Student} = require("../model/m_student");
const {userProfile} = require("../model/m_user_profile");
const {studentPost} = require("../model/m_post");
const {getFileInfo, calculateAge, checkIfUserExist} = require("../helper/helper")
const path = require("path");

const addComments = async(req, res) => {
    await Comments.create(req.body)
    .then( async() => {
        res.status(200).send("Comment Saved Successfuly")
    });
}

const getAllCommentsForPost = async(req, res) => {
    let id = req.query.id;

    let users = await studentPost.findOne({
        where: id,
        include: [
            {
                model: Comments,
                attributes: ['comments'],
                as: "comments_to_post"
            }
        ]
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
    
    req.body.age = await calculateAge(req.body.birthdate);//calculate the birthdate
  
    let student = await checkIfUserExist(Student, {user_id:1}, null) //check if student exist and return the data
    if(!student){
        res.status(404).send('No Student Found');
        return 0;
    }
    
    await Student.update(req.body, {where:{user_id:req.user_info.id}} )//update student and return if there is an error
    .catch( async (err) => {
        console.log(err)
        res.status(500).send(err);
        return 0;
    });

    if(req.files){//check for files and upload the files
        let file_info = await getFileInfo(req.files.file,'profile');
        file_info.student_id = student.id;
        

        await userProfile.upsert({ ...file_info})// insert the data of the files in the database
                .then( async()=> {
                    await req.files.file.mv(`./public/profile/${file_info.file_rand_name}`);
                })
    }

    res.status(200).send('Student updated successfully');
}

const deleteStudent = async(req, res) => {
    
    await Comments.destroy({where: {id: req.query.id}}).then( async(client) => {
        if(client){
            res.send('Comment deleted successfully').status(200)
        }else {
            res.send('Comment not found').status(400)
            return 0;
        }
        
        }).catch( async (err) => {

            res.send(err).status(500);
            return 0;
        });

    
}

const friendRequest = async(req, res) => {
    
}

const addFriend = async(req, res) => {
    let user_id = req.user_info.id;
    let user = await Student.findOne({where:{user_id}});

    let new_arr = JSON.parse(user.friends);

    if(new_arr){
        if(new_arr.includes(req.query.id)){
            res.status(500).send("Student is already in your friend's list");
            return 0;
        }
        new_arr.push(req.query.id);
    }
    else {
        new_arr = [req.query.id]
    }
    
    user.friends = new_arr
    user.save();

    res.send(user);
}
module.exports = { addComments, createStudent, updateStudent, deleteStudent, addFriend};