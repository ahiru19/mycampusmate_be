
const {User} = require("../model/m_user");
const {Friends} = require("../model/m_friends");
const {Student} = require("../model/m_student");
const {userProfile} = require("../model/m_user_profile");
const {Admin} = require("../model/m_admin");
// const {friendRequest} = require("../model/m_friend_requests")
const {getFileInfo, calculateAge, checkIfUserExist} = require("../helper/helper")

const getFriends = async (req, res) => {
    let status = req.query.status;
    await Friends.findAll({
        where: {user_id:req.user_info.id, status},
        include: [
            {
                model:User,
                attributes: ['username', 'email'],
                as: "user_friends",
                include:[
                    {
                      model: Student,
                      attributes: ['id','first_name', 'last_name', 'middle_name'],
                      include: [
                        {
                          model: userProfile,
                          attributes: ['file_path', 'file_name', 'file_rand_name'],
                          as: "student_profile"
                        }
                      ],
                      as: "student"
                  },
                  {
                    model: Admin,
                    attributes: ['id','first_name', 'last_name', 'middle_name'],
                    include: [
                      {
                        model: userProfile,
                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                        as: "admin_profile"
                      }
                    ],
                    as: "admin"
                },
                  ]
            }
        ]
    })
    .then( async (user)=> {
        res.send(user);
    })
    .catch( async(err)=> {
        console.log(err)
        res.status(500).send('Something went wrong');
        return 0;
    })
}

const sendFriendRequest = async (req, res) => {
    try{

       const is_exist = await checkIfUserExist(Friends, {user_id: req.query.id, friend: req.user_info.id, status:0})
       
       if(is_exist){
        res.status(400).send('Already have a pending request');
        return 0;
       }
       else {
            await Friends.create({
                user_id: parseInt(req.query.id),
                friend: req.user_info.id
            })
            .then( async()=> {
                res.send("Friend Request Sent");
            })
            .catch( async(err)=>{
                console.log(err);
                res.status(500).send('Something went wrong');
                return 0;
            })
       }
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err);
        return 0;
    }
}

const confirmFriendRequest = async(req, res) => {
   const friend_request = await checkIfUserExist(Friends, {id:req.query.id});

   if(friend_request){
    console.log(friend_request.status);
        if(friend_request.status === true){
            res.status(500).send("Friend request is already accepted")
            return 0;
        }

        friend_request.status = 1
        friend_request.save();
        res.send('Friend request has been confirmed');
   }
   else{
    res.status(500).send('No friend request found');
    return 0;
   }
}

const rejectFriendRequest = async(req, res) => {
    const friend_request = await checkIfUserExist(Friends, {id:req.query.id});

    if(friend_request){
        friend_request.destroy();
        res.send('Friend request has been rejected');
    }
    else{
     res.status(500).send('No friend request found');
     return 0;
    }
    
}

module.exports = {confirmFriendRequest, sendFriendRequest, getFriends, rejectFriendRequest};