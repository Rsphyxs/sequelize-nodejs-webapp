// import controllers review, products
const userController = require('../controllers/userController.js')

// router
const router = require('express').Router()


// use routers
router.post('/addUser', userController.addUser)
router.get('/Tes', userController.Tes)


module.exports = router