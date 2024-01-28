const {studentFiles} = require("../model/m_files");
const {studentPost} = require("../model/m_post")
const {getFileInfo} = require("../helper/helper");

const createPost = async (req,res) => {

    let body = req.body;
    body.visibility = parseInt(body.visibility);
    
    await studentPost.create({...body})
    .then( async(post) => {
        if(req.files){
            let files = req.files
            
            if(typeof files == 'object'){

                let result = await getFileInfo(files.file, 'posts');
                let post = {...body, ...result}

                console.log(body)
                    await files.file.mv(`./public/posts/${body.file_rand_name}`);
                    
            }
            else{
                for(let x in files){
                    let result = await getFileInfo(files[x].file, 'posts');

                    await files[x].file.mv(`./public/posts/${body.file_rand_name}`);
                }
            }
        }
        res.send('done');
    })

   
   
    
} 



module.exports = {createPost}