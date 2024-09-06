const express = require('express');
const router = express.Router();
const POSTS_CONTROLLER = require('../../../../controllers/post.controller');
const PIC = require('../../../../config/storage/cloud');

//Endpoint posts
router.get('/', POSTS_CONTROLLER.index);

router.post('/create', PIC.post.single('pic'), POSTS_CONTROLLER.createPost);

router.get('/:id', POSTS_CONTROLLER.postById);

router.put('/update/:id', POSTS_CONTROLLER.updatePostById);

router.delete('/delete/:id', POSTS_CONTROLLER.deletePostById);

module.exports = router;