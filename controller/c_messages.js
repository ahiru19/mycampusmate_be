const {Student} = require("../model/m_student");
const {Messages} = require("../model/m_messages");


const getMessages = async (req, res) => {

    await Messages.findAll({ where: {from: req.query.from, to:req.query.to}})
    .then( async(messages)=>{
        res.status.send(messages);
    })
    
}

const addMessages = async (req, res) => {

    await Messages.create({ ...req.body})
    .then( async()=>{
        res.status.send('Message sent');
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

module.exports = {getMessages, addMessages, deleteMessages}