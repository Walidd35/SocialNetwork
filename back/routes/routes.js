const express = require('express');
const router = express.Router();
const auth = require('../middlewares/jwtAuth')
const userCtrl = require('../controllers/user.controller');
const postCtrl = require('../controllers/post.controller')
const upload = require('../middlewares/multerUpload')

// Route pour le modèle User
router.delete('/users/:id',auth,userCtrl.deleteUserById);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/users',userCtrl.getAll);
router.get('/user/:id', userCtrl.getById);

// Route pour le modèle Post
router.post('/posts', upload.single('image'), postCtrl.createPost);
module.exports = router;
