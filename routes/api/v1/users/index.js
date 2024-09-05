const express = require('express');
const router = express.Router();
const USERS_CONTROLLERS = require('../../../../controllers/user.controller');
const PIC = require('../../../../config/storage/cloud');
const AUTH_MIDDLEWARE = require('../../../../middleware/auth.middleware')

//Endpoint users
//GET all users data
router.get('/',AUTH_MIDDLEWARE, USERS_CONTROLLERS.index);

//POST user data
router.post('/create', USERS_CONTROLLERS.createUser);

//GET user data by id
router.get('/:id', AUTH_MIDDLEWARE, USERS_CONTROLLERS.userById);

//PUT user profile pic
router.put('/upload-profile-pic/:id', PIC.post.single('profilePicture'), USERS_CONTROLLERS.updateProfilePic);

//PUT user data
router.put('/update/:id', USERS_CONTROLLERS.updateUser);

//PUT user password
router.put('/change-password/:id', USERS_CONTROLLERS.changePassword);

module.exports = router;