const {studentFiles} = require("../model/m_files");
const {studentPost} = require("../model/m_post")
const {getFileInfo} = require("../helper/helper");
const {Student} = require("../model/m_student");
const {userProfile} = require("../model/m_user_profile")

const createPost = async (req,res) => {

    let body = req.body;
    body.visibility = parseInt(body.visibility);
    
    await studentPost.create({...body})
    .then( async(student_post) => {
        if(req.files){
            let files = req.files
            
            if(typeof files == 'object'){

                let result = await getFileInfo(files.file, 'posts');
                let post = {...body, ...result}
                post.post_id = student_post.id;
                await studentFiles.create(post);
                await files.file.mv(`./public/posts/${result.file_rand_name}`);
                
            }
            else{
                for(let x in files){
                    let result = await getFileInfo(files[x].file, 'posts');
                    let post = {...body, ...result}
                    post.post_id = student_post.id;
                    await studentFiles.create(post);
                    await files[x].file.mv(`./public/posts/${result.file_rand_name}`);
                }
            }
        }
        res.send('done');
    })

   
   
    
} 

const getPost = async (req,res) => {
    // let user_id = req.user_info.id;
    // if(req.user_info.usertype == 1){
    let posts =  await studentPost.findAll({
        include:[
            {
                model: Student,
                attributes: ['first_name', 'last_name', 'middle_name','age','address','student_num'],
                as: 'studentpost',
                include: [
                    {
                        model: userProfile,
                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                        as: "student_profile"
                    }
                ]
            },
            {
                model: studentFiles,
                as: 'post_files',
                attributes:['file_path', 'file_name','file_rand_name']
            }
        ]
    });

    //     res.send(studentPost);
    // }
    // else if(req.user_info.usertype == 2){

    //     let student = studentPost.findOne({where: {user_id}, attribute: ['friends']});
    //     let friends = student.friends;
    //     await studentPost.findAll({
    //         where: {user_id, }, 
            
    //     })
    // }

    res.send(posts)
}


module.exports = {createPost, getPost}