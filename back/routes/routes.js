const express = require('express');
const router = express.Router();
const auth = require('../middlewares/jwtAuth');
const authorizeRoles = require('../middlewares/rolesAuth');
const verifyOwnership = require('../middlewares/verifyOwner');
const userCtrl = require('../controllers/user.controller');
const postCtrl = require('../controllers/post.controller');
const upload = require('../middlewares/multerUpload');

// Fonctions pour l'extraction des IDs
const getIds = {
    fromParams: (req) => req.params.id,
    fromBody: (req) => req.body.userId,
    fromAuth: (req) => req.auth.userId
};

// Routes Utilisateurs
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Routes protégées utilisateurs
router.get('/users', 
    auth,
    authorizeRoles('admin'),
    userCtrl.getAll
);

router.get('/user/:id',
    auth,
    authorizeRoles('user', 'admin'),
    (req, res, next) => {
        // Permet à l'admin de voir tous les profils et aux utilisateurs de voir leur propre profil
        if (req.auth.roles.includes('admin') || req.auth.userId === parseInt(req.params.id)) {
            next();
        } else {
            res.status(403).json({ message: 'Accès non autorisé' });
        }
    },
    userCtrl.getById
);

router.delete('/users/:id',
    auth,
    authorizeRoles('user', 'admin'),
    (req, res, next) => {
        // Permet à l'admin de supprimer n'importe quel compte et aux utilisateurs de supprimer leur propre compte
        if (req.auth.roles.includes('admin') || req.auth.userId === parseInt(req.params.id)) {
            next();
        } else {
            res.status(403).json({ message: 'Accès non autorisé' });
        }
    },
    userCtrl.deleteUserById
);

// Routes Posts
router.post('/posts',
    auth,
    authorizeRoles('user', 'admin'),
    upload.single('image'),
    (req, res, next) => {
        // Assure que l'userId du post correspond à l'utilisateur authentifié
        req.body.userId = req.auth.userId;
        next();
    },
    postCtrl.createPost
);

router.get('/allposts',
    auth,
    postCtrl.getAllPosts
);

router.get('/post/:id',
    auth,
    postCtrl.getPostById
);

router.put('/putpost/:id',
    auth,
    authorizeRoles('user', 'admin'),
    upload.single('image'),
    async (req, res, next) => {
        try {
            const post = await postCtrl.getPostById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé' });
            }
            // Permet à l'admin de modifier n'importe quel post et aux utilisateurs de modifier leurs propres posts
            if (req.auth.roles.includes('admin') || post.userId === req.auth.userId) {
                next();
            } else {
                res.status(403).json({ message: 'Accès non autorisé' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    postCtrl.updatePost
);

router.delete('/deletepost/:id',
    auth,
    authorizeRoles('user', 'admin'),
    async (req, res, next) => {
        try {
            const post = await postCtrl.getPostById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé' });
            }
            // Permet à l'admin de supprimer n'importe quel post et aux utilisateurs de supprimer leurs propres posts
            if (req.auth.roles.includes('admin') || post.userId === req.auth.userId) {
                next();
            } else {
                res.status(403).json({ message: 'Accès non autorisé' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    postCtrl.deletePost
);

module.exports = router;