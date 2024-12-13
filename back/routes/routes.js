const express = require("express");
const router = express.Router();
const auth = require("../middlewares/jwtAuth");
const { authorizeRoles, verifyOwnership } = require("../middlewares/rolesAuth");
const userCtrl = require("../controllers/user.controller");
const postCtrl = require("../controllers/post.controller");
const cmtCtrl = require("../controllers/comment.controller");
const upload = require("../middlewares/multerUpload");
const Post = require("../models/posts.model");
const Comments = require("../models/comments.model");
const User = require("../models/users.model");

// Routes Utilisateurs
router.post("/auth/signup", userCtrl.signup);
router.post("/auth/login", userCtrl.login);
router.post("auth/logout",userCtrl.logout);
router.get("/all/users", auth, authorizeRoles("admin"), userCtrl.getAllUsers);
router.get( "/user/:id",auth,authorizeRoles("user", "admin"), (req, res, next) => {
    //Permet à l'admin de voir tous les profils et aux u$sers de voir leur propre profil
    if (
      req.auth.roles.includes("admin") ||
      req.auth.userId === parseInt(req.params.id)
    ) {
      next();
    } else {
      res.status(403).json({ message: "Accès non autorisé" });
    }
  },
  userCtrl.getUserById
);
router.put(
  "/user/:id",
  auth,
  authorizeRoles("user", "admin"),
  verifyOwnership(async (req) => {
    return await User.findByPk(req.params.id);
  }),
  userCtrl.updateUser
);
router.delete(
  "/user/:id",
  auth,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    //Permet à l'admin de supprimer n'importe quel compte et aux utilisateurs de suprimer leur propre compte
    if (
      req.auth.roles.includes("admin") ||
      req.auth.userId === parseInt(req.params.id)
    ) {
      next();
    } else {
      res.status(403).json({ message: "Accès non autorisé" });
    }
  },
  userCtrl.deleteUser
);


// Routes pour les Posts
router.post(
  "/post",
  auth,
  authorizeRoles("user", "admin"),
  upload.single("image"),
  (req, res, next) => {
    req.body.userId = req.auth.userId;
    next();
  },
  postCtrl.createPost
);
router.get("/all/posts", postCtrl.getAllPosts);
router.get("/post/:id", auth, postCtrl.getPostById);
router.put(
  "/put/post/:id",
  auth,
  authorizeRoles("user", "admin"),
  verifyOwnership(async (req) => {
    return await Post.findByPk(req.params.id);
  }),
  postCtrl.updatePost
);
router.delete(
  "/delete/post/:id",
  auth,
  authorizeRoles("user", "admin"),
  async (req, res, next) => {
    try {
      const postId = req.params.id;

      //recherche du post dans la base de données
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ message: "Post non trouvé." });
      }

      // Vérification des droits de l'utilisateur pour la suppression
      const isOwner = post.user_id === req.auth.userId; // L'utilisateur est-il propriétaire du post ?
      const isAdmin = req.auth.roles.includes("admin"); // L'utilisateur est-il administrateur ?

      if (isOwner || isAdmin) {
        // Si l'utilisateur est le propriétaire ou un administrateur,il peut supprimer le post
        return postCtrl.deletePost(req, res, next);
      } else {
        return res.status(403).json({ message: "Accès non autorisé" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du post :", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression du post." });
    }
  }
);


// Route pour Commentaires
router.post("/create/:postId/comment", auth, cmtCtrl.createComment);
router.get("/all/comments", auth, cmtCtrl.getAllComments);
router.get("/posts/:postId/comments", auth, cmtCtrl.getCommentsByPostId);
router.put(
  "/comment/:commentId",
  auth,
  verifyOwnership(async (req) => {
    return await Comments.findByPk(req.params.commentId); 
  }),
  cmtCtrl.modifyComment
);
router.delete(
  "/comment/:commentId",
  auth,
  authorizeRoles("user", "admin"),
  cmtCtrl.deleteComment
);


module.exports = router;
//Verifier route et controller commentaire ensuite crud admin ensuite test unitaire
