const {studentFiles} = require("../model/m_files");
const {studentPost} = require("../model/m_post");
const {Comments} = require("../model/m_comments");
const {getFileInfo} = require("../helper/helper");
const {Student} = require("../model/m_student");
const {Admin} = require("../model/m_admin");
// const { Sequelize } = require("sequelize");
const {userProfile} = require("../model/m_user_profile")
const path = require("path");
var fs = require('fs');

const createPost = async (req,res) => {
    let body = req.body;
    let user_id = req.user_info.id;
    let usertype = req.user_info.usertype;
    
    if(usertype == 1){
        let user = await Admin.findOne({where:{user_id}});
        body.admin_id = user.id;
    }
    else {
        let user = await Student.findOne({where:{user_id}});
        body.student_id = user.id;
    }


    body.visibility = parseInt(body.visibility);
    
    await studentPost.create({...body})
    .then( async(student_post) => {
        if(req.files){
            let files = req.files
            
            if(typeof files == 'object'){

                let result = await getFileInfo(files.file, 'posts');
                result.post_id = student_post.id;
                // console.log(result);
                await studentFiles.create(result);
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
      

    let posts =  await studentPost.findAll({
        order: [['createdAt', 'DESC']],
        // attributes:{
        //     include:[[Sequelize.fn("COUNT", Sequelize.col("JSON_LENGTH('likes')")), "like_count"]]
        // },
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
                model: Admin,
                as: 'adminpost',
                include: [
                    {
                        model: userProfile,
                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                        as: "admin_profile"
                    }
                ]
            },
            {   
                model: studentFiles,
                as: 'post_files',
                attributes:['file_path', 'file_name','file_rand_name']
            },
            {
                model: Comments,
                as: 'comments_to_post',
                attributes:['comments'],
                include: [
                    {
                        model: Student,
                        attributes: ['first_name', 'last_name', 'middle_name'],
                        as: 'studentcomments',
                        include: [
                            {
                                model: userProfile,
                                attributes: ['file_path', 'file_name', 'file_rand_name'],
                                as: "student_profile"
                            }
                        ]
                    },
                ]
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

const getOnePost = async (req,res) => {
        let users = await Student.findOne({
            where: {id: req.query.id},
            include: [
                {
                    model: userProfile,
                    attributes: ['file_path', 'file_name', 'file_rand_name'],
                    as: "student_profile"
                },
                {
                    model: studentPost,
                    order:[['createdAt', 'DESC']],
                    separate:true,
                    as: "poststudent",
                    include: [
                        {
                            model: studentFiles,
                            order:[['createdAt', 'DESC']],
                            attributes: ['file_path', 'file_name', 'file_rand_name'],  
                            as: "post_files",
                           
                        }
                    ]
                }
            ]
        });
    
        res.send(users);

}

const deletePost = async (req,res) => {
    let post_id = req.query.id

    let post = await studentPost.findOne({where:{id:post_id}});

    let file_post = await studentFiles.findOne({ where: {post_id}});
    if(file_post){
        let file_path = file_post.file_path + file_post.file_rand_name;
        
        fs.unlink(`.${file_path}`, (err) => {
            if(err){
                console.log(err);
                res.status(500).send('Something went wrong')
                return 0;
            };
          });
         await file_post.destroy();
    }
     await post.destroy();
    
    res.send('Deleted Successfuly');
}

const addLike = async (req, res) => {
    try{
       
        const post = await studentPost.findOne({where: {id:req.query.id}})
        
        let new_arr = JSON.parse(post.likes);
        // console.log(new_arr);

        if(new_arr.length > 0){
           
            if(new_arr.includes(req.user_info.id)){

                user_index = new_arr.indexOf(req.user_info.id);

                if(user_index > -1){
                    new_arr.splice(user_index, 1);
                    console.log(new_arr)
                }
               
            }else {
                new_arr.push(req.user_info.id);
            }
        }
        else {
            
            new_arr = [req.user_info.id]
        }
        
        new_arr = JSON.stringify(new_arr);
        post.likes = new_arr;
        post.save();
        res.send('Success');
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err);
    }
}


module.exports = {createPost, getPost, deletePost, getOnePost, addLike}