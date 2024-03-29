const {Student} = require("../model/m_student");
const {Admin} = require("../model/m_admin");
const {userProfile} = require("../model/m_user_profile")
const {Messages} = require("../model/m_messages");
const { Op } = require("sequelize");
const {User} = require("../model/m_user");
const {groupChat} = require("../model/m_group_chat");
const {groupMember} = require("../model/m_group_member");

const getMessages = async(req, res) => {
    let messages = await Messages.findAll({
        group:"convo_id",
        where:{
            [Op.or]:[
                {from:req.user_info.id},
                {to:req.user_info.id}
        ]
        },
        // order:["createdAt","DESC"],
        include: [
            {
                model: User,
                attributes: ['email', 'username'],
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
            {
                model: User,
                attributes: ['email', 'username'],
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
            {
                model: groupChat,
                attributes: ['id','group_name'],
                as: "message_group"
            }
        ]
        
    })

    res.send(messages);
}

const getOneMessages = async (req, res) => {

    await Messages.findAll({ 
        where:{ 
            [Op.or]:[
                {[Op.and]: [{from:req.query.from}, {to:req.query.to}]},
                {[Op.and]: [{to:req.query.from}, {from:req.query.to}]}
     ]},
        include: [
            {
                model: User,
                attributes: ['email', 'username'],
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
            {
                model: User,
                attributes: ['email', 'username'],
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
        
        })
    .then( async(messages)=>{
        res.send(messages);
        return 0;
    })
    
}

const addMessages = async (req, res) => {
    const message = await Messages.findOne({
        where: {
            [Op.or]: [
                { [Op.and]: [{from: req.body.to}, {to:req.body.from}] },
                { [Op.and]: [{from: req.body.from}, {to:req.body.to}] }

            ]
           
        },
        attributes:["id","convo_id"]
    })

    if(message){
        req.body.convo_id = message.convo_id;
    }
    else {
        req.body.convo_id = require('crypto').randomBytes(12).toString('hex')
    }
    await Messages.create({ ...req.body})
    .then( async()=>{
        res.send('Message sent');
    })
    
}

const deleteMessages = async (req, res) => {

    await Messages.findOne({ where:{id:req.query.msg_id}})
    .then( async(msg)=>{
        await msg.destroy().then( async () => {
            res.status(200).send('Message removed')
        }
        )
        
    })
    
}

module.exports = {getMessages, getOneMessages, addMessages, deleteMessages}