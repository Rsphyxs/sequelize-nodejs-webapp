const db = require('../models')

// create main Model
const User = db.users

// main work

// 1. create product

const addUser = async (req, res) => {

    User.create({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    }).then(function(){
        res.status(200).json({
            "Message" : "User Created!",
        }).send()
    }).catch(function(err){
        res.status(500).json({
            "Message" : err
        }).send()
    })

}

const Tes = async (req, res) => {

    res.status(200).json({
        "Message" : "Sukses!!",
    }).send()

}

module.exports = {
    addUser,
    Tes
}