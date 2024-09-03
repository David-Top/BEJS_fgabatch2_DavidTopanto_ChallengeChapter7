const express = require('express');
const router = express.Router();
const POSTS_ROUTER = require('./posts');
const USERS_ROUTER = require('./users')

//Endpoint Homepage
router.get('/', (req, res) => {
    res.send('Welcome to Blog Web App');
})

router.use('/posts', POSTS_ROUTER);

router.use('/users', USERS_ROUTER);

module.exports = router;