const express = require('express');
const router = express.Router()


const userCtrl = require('../controllers/user.controller');

router.post('/signup', userCtrl.signup)






module.exports = router;