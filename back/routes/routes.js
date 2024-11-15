const express = require('express');
const router = express.Router();
const auth = require('../middlewares/jwtAuth');
const authorizeRoles = require('../middlewares/rolesAuth');
const verifyOwnership = require('../middlewares/verifyOwner');
const userCtrl = require('../controllers/user.controller');
const postCtrl = require('../controllers/post.controller');
const upload = require('../middlewares/multerUpload');

// Vérifiez que les contrôleurs sont bien définis
console.log('postCtrl:', postCtrl); // Ajoutez ceci pour debug

// Helper functions
const getUserIdFromParams = (req) => req.params.id;
const getPostUserIdFromBody = (req) => req.body.userId;

// User routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/users', auth, authorizeRoles('admin'), userCtrl.getAll);
router.get('/user/:id', auth, verifyOwnership(getUserIdFromParams), userCtrl.getById);
router.delete('/users/:id', auth, authorizeRoles('user', 'admin'), verifyOwnership(getUserIdFromParams), userCtrl.deleteUserById);

// Post routes
router.post('/posts', auth, authorizeRoles('user', 'admin'), upload.single('image'), postCtrl.createPost);

// Vérifiez que getAllPosts existe
router.get('/allposts', auth, (req, res, next) => {
    if (!postCtrl.getAllPosts) {
        return res.status(500).json({ error: 'getAllPosts not defined' });
    }
    postCtrl.getAllPosts(req, res, next);
});

// Simplifiez temporairement cette route pour debugging
router.get('/post/:id', auth, (req, res) => {
    if (!postCtrl.getPostById) {
        return res.status(500).json({ error: 'getPostById not defined' });
    }
    postCtrl.getPostById(req, res);
});

router.put('/putpost/:id', auth, authorizeRoles('user', 'admin'), verifyOwnership(getPostUserIdFromBody), upload.single('image'), postCtrl.updatePost);
router.delete('/deletepost/:id', auth, authorizeRoles('user', 'admin'), verifyOwnership(getPostUserIdFromBody), postCtrl.deletePost);

module.exports = router;