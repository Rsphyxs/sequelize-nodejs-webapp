// import controllers review, products
const userController = require('../controllers/userController.js')

// router
const router = require('express').Router()


// use routers
router.post('/register', userController.register)
router.get('/login', userController.login)
router.post('/update', userController.update)


module.exports = router