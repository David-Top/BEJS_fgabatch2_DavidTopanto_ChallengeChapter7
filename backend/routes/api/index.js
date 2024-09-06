const express = require('express');
const router = express.Router();
const V1_ROUTER = require('./v1');

router.use('/v1', V1_ROUTER);

module.exports = router;