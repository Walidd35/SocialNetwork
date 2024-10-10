const express = require('express');
const router = express.Router()


const userCtrl = require('../controllers/user.controller');

// Route pour le modèle User

router.delete('/user/:id', userCtrl.deleteUserById);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login );
router.get('/users', userCtrl.getAll);

module.exports = router;