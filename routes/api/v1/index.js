const express = require('express');
const router = express.Router();
const POSTS_ROUTER = require('./posts');
const USERS_ROUTER = require('./users');
const AUTH_CONTROLLER = require('../../../controllers/auth.controller');

//Endpoint Homepage
router.get('/', (req, res) => {
    res.send('Welcome to Blog Web App');
})

//Endpoint for Authentication Register
router.post('/register', AUTH_CONTROLLER.register);

//Endpoint for Authentincation Feature
router.post('/login', AUTH_CONTROLLER.login);

//Endpoint for Froget Password
router.post('/forget-password', AUTH_CONTROLLER.forgetPassword);

//Endpoint for Change Password
router.put('/change-password/:id', AUTH_CONTROLLER.changePassword)

//Endpoint for Users Feature
router.use('/users', USERS_ROUTER);

//Endpoint for Posts Feature
router.use('/posts', POSTS_ROUTER);

module.exports = router;