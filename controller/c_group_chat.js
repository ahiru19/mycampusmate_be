const {Student} = require("../model/m_student");
const {Admin} = require("../model/m_admin");
const {userProfile} = require("../model/m_user_profile");
const {Messages} = require("../model/m_messages");
const { Op } = require("sequelize");
const {User} = require("../model/m_user");
const {groupChat} = require("../model/m_group_chat");
const {groupMember} = require("../model/m_group_member");
const {getFileInfo, calculateAge, checkIfUserExist} = require("../helper/helper")

const createGroupChat = async(req, res) => {
    req.body.group_admin = req.user_info.id;
    await groupChat.create(req.body)
    .then( async(group)=> {
        res.send('Group chat created')

        await groupMember.create({
            group_id: group.id,
            user_id: group.group_admin
        })
    })
    .catch( async(err)=> {
        console.log(err);
        res.status(500).send('Something went wrong')
        return 0;
    })
}

const addMember = async(req, res) => {
    const check_user = await checkIfUserExist(groupMember, {group_id:req.body.group_id, user_id: req.body.user_id});
    if(check_user){
        res.status(500).send('User is already in the group');
    }
    await groupMember.create(req.body)
    .then( async(group)=> {
        res.send('Group member added')
    })
    .catch( async(err)=> {
        console.log(err);
        res.status(500).send('Something went wrong')
        return 0;
    })
}

const addMessage = async(req, res) => {
    req.body.for_gc = 1;
    req.body.from = req.user_info.id;

    const check_user = await Messages.findOne({
        where: {gc_id : req.body.gc_id}
    })
    if(check_user){
        req.body.convo_id = check_user.convo_id;
    }
    else {
        req.body.convo_id = require('crypto').randomBytes(12).toString('hex')
    }


    await Messages.create(req.body)
    .then( async(message)=> {
        res.send('Message sent')
    })
    .catch( async(err)=> {
        console.log(err);
        res.status(500).send('Something went wrong')
        return 0;
    })
}

const getMessages = async(req,res) => {
    await groupChat.findAll({
        where: {id: req.query.id},
        exclude: ['createdAt'],
        include: [
            {
                model: Messages,
                attributes: ['id','message', 'createdAt'],
                as: "group_message",
                include: [
                    { // para sa user to get the admin and student sa message_to
                        model: User,
                        attributes: ['id','email'],
                        as: "message_to_user_to",
                        include:[
                            {
                                model: Admin,
                                attributes: ["id", "first_name","middle_name", "last_name"],
                                as: 'admin',
                                include: [
                                    {
                                        model: userProfile,
                                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                                        as: "admin_profile"
                                    }
                                ]
                            },
        
                            {
                                model: Student,
                                attributes: ["id", "first_name","middle_name", "last_name"],
                                as: 'student',
                                include: [
                                    {
                                        model: userProfile,
                                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                                        as: "student_profile"
                                    }
                                ]
                            },
                            
                        ]
                    },
                    { // para sa user to get the admin and student sa message_from
                        model: User,
                        attributes: ['id','email'],
                        as: "message_to_user_from",
                        include:[
                            {
                                model: Admin,
                                attributes: ["id", "first_name","middle_name", "last_name"],
                                as: 'admin',
                                include: [
                                    {
                                        model: userProfile,
                                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                                        as: "admin_profile"
                                    }
                                ]
                            },
        
                            {
                                model: Student,
                                attributes: ["id", "first_name","middle_name", "last_name"],
                                as: 'student',
                                include: [
                                    {
                                        model: userProfile,
                                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                                        as: "student_profile"
                                    }
                                ]
                            },
                            
                        ]
                    },
                ]
            }
        ]
    })
    .then ( async (messages) => {
        res.send(messages)
    })
    .catch ( async (err) => {
        console.log(err)
        res.status(500).send('Something went wrong');
        return 0;
    })
}

const getGroupChat = async(req, res) => {
    await groupChat.findAll({
        attributes: ['id', 'group_name'],
        include: [
            {
                model:groupMember,
                where: {user_id: req.user_info.id},
                attributes: ['id'],
                as: "group_to_member"
            }
        ]
    })
    .then ( async(user) => {
        res.send(user);
    })
    .catch ( async(err) => {
        console.log(err);
        res.status(500).send('Something went wrong')
        return 0;
    })
}

const getMembers = async(req, res) => {
    await groupChat.findAll({
        where: {id: req.query.id},
        attributes: ['id', 'group_name'],
        include: [
            {
                model:groupMember,
                attributes: ['id'],
                as: "group_to_member",
                include: [
                    { // para sa user to get the admin and student sa message_to
                        model: User,
                        attributes: ['id','email'],
                        as: "group_user",
                        include:[
                            {
                                model: Admin,
                                attributes: ["id", "first_name","middle_name", "last_name"],
                                as: 'admin',
                                include: [
                                    {
                                        model: userProfile,
                                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                                        as: "admin_profile"
                                    }
                                ]
                            },
        
                            {
                                model: Student,
                                attributes: ["id", "first_name","middle_name", "last_name"],
                                as: 'student',
                                include: [
                                    {
                                        model: userProfile,
                                        attributes: ['file_path', 'file_name', 'file_rand_name'],
                                        as: "student_profile"
                                    }
                                ]
                            },
                            
                        ]
                    },
                ]
            }
        ]
    })
    .then ( async(user) => {
        res.send(user);
    })
    .catch ( async(err) => {
        console.log(err);
        res.status(500).send('Something went wrong')
        return 0;
    })
}


module.exports = {createGroupChat, addMember, addMessage, getMessages, getGroupChat, getMembers}