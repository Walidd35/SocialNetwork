const express = require('express');
const router = express.Router();
const auth = require('../middlewares/jwtAuth');
const { authorizeRoles, verifyOwnership } = require('../middlewares/rolesAuth');
const userCtrl = require('../controllers/user.controller');
const postCtrl = require('../controllers/post.controller');
const cmtCtrl = require('../controllers/comment.controller')
const upload = require('../middlewares/multerUpload');
const Post = require('../models/posts.model')
const Comments = require('../models/comments.model')
const User = require('../models/users.model')

// Routes Utilisateurs
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/users', 
    auth,
    authorizeRoles('admin'),
    userCtrl.getAllUsers
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
    userCtrl.getUserById
);
router.put('/putuser/:id', 
    auth,
    authorizeRoles('user', 'admin'),
    verifyOwnership(async (req) => {
      return await User.findByPk(req.params.id);
    }),
    userCtrl.updateUser  // Ajout du contrôleur ici
  );
router.delete('/user/:id',
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
    userCtrl.deleteUser
);


// Routes pour les Posts
router.post('/post',
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
    postCtrl.getAllPosts
);
router.get('/getpost/:id',
    auth,
    postCtrl.getPostById
);
router.put(
    '/putpost/:id',
    auth,
    authorizeRoles('user','admin'),
    verifyOwnership(async (req) => {
      return await Post.findByPk(req.params.id); // Assure de vérifier le post par ID
    }),
    postCtrl.updatePost
); 
router.delete('/deletepost/:id', auth, authorizeRoles('user', 'admin'), async (req, res, next) => {
    try {
      const postId = req.params.id;
  
      // Recherche du post dans la base de données
      const post = await Post.findByPk(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post non trouvé.' });
      }
  
      // Vérification des droits de l'utilisateur pour la suppression
      const isOwner = post.user_id === req.auth.userId; // L'utilisateur est-il propriétaire du post ?
      const isAdmin = req.auth.roles.includes('admin');  // L'utilisateur est-il administrateur ?
  
      if (isOwner || isAdmin) {
        // Si l'utilisateur est le propriétaire ou un administrateur, on peut supprimer le post
        return postCtrl.deletePost(req, res, next);
      } else {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du post :', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression du post.' });
    }
});
  

// Route pour créer un commentaire sur un post
router.post('/posts/:postId/comments', auth, cmtCtrl.createComment);
router.get('/allcomments',auth,cmtCtrl.getAllComments);
router.get('/getcomments/:commentId',auth,cmtCtrl.getCommentById);
router.put(
    '/comments/:commentId',
    auth,
    verifyOwnership(async (req) => {
      return await Comments.findByPk(req.params.commentId); // Recherche le commentaire
    }),
    cmtCtrl.modifyComment
);
router.delete('/comments/:commentId',auth ,authorizeRoles('user', 'admin'),cmtCtrl.deleteComment);




module.exports = router;
//Verifier route et controller commentaire ensuite crud admin ensuite test unitaire