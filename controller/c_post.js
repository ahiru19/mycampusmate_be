const {studentFiles} = require("../model/m_files");
const {studentPost} = require("../model/m_post");
const {Comments} = require("../model/m_comments");
const {getFileInfo, checkIfUserExist} = require("../helper/helper");
const {Student} = require("../model/m_student");
const {Admin} = require("../model/m_admin");
const {User} = require("../model/m_user");
// const { Sequelize } = require("sequelize");
const {userProfile} = require("../model/m_user_profile")
const { Op } = require("sequelize");
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

const getPost = async (req,res) => { //get all posts
      

    let posts =  await studentPost.findAll({
        where: {
            [Op.or]: [ {is_reported:1} , {is_reported: 0}]
        },
        order: [['createdAt', 'DESC']],
        // attributes:{
        //     include:[[Sequelize.fn("COUNT", Sequelize.col("JSON_LENGTH('likes')")), "like_count"]]
        // },
        include:[
            {
                model: Student,
                attributes: ['id','first_name', 'last_name', 'middle_name','age','address','student_num'],
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
                attributes:['id','comments'],
                include: [
                    {
                        model: Student,
                        attributes: ['id','first_name', 'last_name', 'middle_name'],
                        as: 'studentcomments',
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
                        attributes: ['id','first_name', 'last_name', 'middle_name'],
                        as: 'admincomments',
                        include: [
                            {
                                model: userProfile,
                                attributes: ['file_path', 'file_name', 'file_rand_name'],
                                as: "admin_profile"
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

const getUserPost = async (req,res) => { // get all post of the user based on id

    let wh = {}
    if(req.query.student_id){
        wh = { student_id : req.query.student_id}
    }
    else if(req.query.admin_id){
        wh = { admin_id : req.query.admin_id}
    }

    let posts =  await studentPost.findAll({
        where: wh,
        order: [['createdAt', 'DESC']],
        include:[
            {
                model: Student,
                attributes: ['id','first_name', 'last_name', 'middle_name','age','address','student_num'],
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
                attributes:['id','comments'],
                include: [
                    {
                        model: Student,
                        attributes: ['id','first_name', 'last_name', 'middle_name'],
                        as: 'studentcomments',
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
                        attributes: ['id','first_name', 'last_name', 'middle_name'],
                        as: 'admincomments',
                        include: [
                            {
                                model: userProfile,
                                attributes: ['file_path', 'file_name', 'file_rand_name'],
                                as: "admin_profile"
                            }
                        ]
                    },
                ]
            }
        ]
    });

    res.send(posts)
}


const getOnePost = async (req,res) => { //get a specific post based on id
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
                           
                        },
                        {
                            model: Comments,
                            attributes: ['id','comments'],
                            as: "comments_to_post",
                            include: [
                                {
                                    model: Student,
                                    attributes: ['id','first_name', 'last_name', 'middle_name'],
                                    as: 'studentcomments',
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
                                    attributes: ['id','first_name', 'last_name', 'middle_name'],
                                    as: 'admincomments',
                                    include: [
                                        {
                                            model: userProfile,
                                            attributes: ['file_path', 'file_name', 'file_rand_name'],
                                            as: "admin_profile"
                                        }
                                    ]
                                },
                            ]
                        },
                    ]
                },
             
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

        if(new_arr && new_arr.length > 0){
           
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

const reportPost = async (req, res) => {
    
    let post = await checkIfUserExist(studentPost, {id: req.body.post_id});
    if(!post){
            res.status(404).send('Post not found');
            return 0;
    }
    else {
        if(req.user_info.usertype == 1){ //check if admin
            post.is_reported = 2;
        }
        else {//if not then check student
            post.is_reported = 1;
        }
        
        post.reporter_id = req.user_info.id;
        post.reason_for_report = req.body.reason;
        post.save();
        res.send('Post reported successfuly')
    }
}

const getReportedPost = async (req, res) => {

    // let wh = {is_reported: 1}
    // if(req.query.admin_id){
    //     wh['admin_id'] = req.query.admin_id;
    // }
    // else if(req.query.student_id){
    //     wh['student_id'] = req.query.student_id;
    // }
    // else {
    //     res.status(400).send('No ID was given')
    //     return 0;
    // }
    await studentPost.findAll({
        where: {
            [Op.or]: [
                {is_reported:1},
                {is_reported:2}
        ]},
        include: [
             { model:User,
              attributes:['id', 'username'],
              as: "report_to_user",
              include:  
              [
                {
                    model: Student,
                    attributes: ['id','first_name', 'last_name', 'middle_name'],
                    as: 'student',
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
                    as: 'admin',
                    attributes:['id','first_name','middle_name','last_name'],
                    include: [
                        {
                            model: userProfile,
                            attributes: ['file_path', 'file_name', 'file_rand_name'],
                            as: "admin_profile"
                        }
                    ]
                },
              ]
            }
        ]
    })
    .then( (users)=> {
        res.send(users)
    })
    .catch( (err)=> {
        console.log(err);
        res.status(500).send('Something went wrong');
        return 0;
    })
}

const approveReport = async (req, res) => {
    let post = await studentPost.findOne({ where: {id: req.query.id, is_reported: 1}});
    if(!post){
        res.status(400).send('No post found')
        return 0;
    }
    else {
        post.is_reported = 2;
        post.save();
        res.send('Report Approved');
    }
}

module.exports = {createPost, getPost, deletePost, getOnePost, addLike, reportPost, getReportedPost, approveReport, getUserPost}