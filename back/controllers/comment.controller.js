const Comment = require("../models/comments.model"); 
const Post = require("../models/posts.model"); 
const User = require('../models/users.model');

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body; 
    const postId = req.params.postId; 
    const userId = req.auth.userId; 

    
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    // Créer le commentaire
    const newComment = await Comment.create({
      content, 
      post_id: postId, 
      user_id: userId, 
    });

    
    res
      .status(201)
      .json({
        message: "Commentaire envoyée avec succès",
        commentaire: newComment,
      });
  } catch (error) {
    console.error("Erreur lors de l/envoi du commentaire:", error);
    res.status(500).json({ error: "Erreur lors de de l/envoi du commentaire" });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    
    const comments = await Comment.findAll({
      include: [
        {
          model: User, 
          attributes: ["user_id", "email"], 
        },
        {
          model: Post, 
          attributes: ["post_id", "title", "description", "image"], 
        },
      ],
    });

    // Regrouper les commentaires par post
    const groupedComments = comments.reduce((acc, comment) => {
     
      const postId = comment.Post.post_id;

      // Si le post n'a pas encore été ajouté à l'accumulateur, l'ajouter
      if (!acc[postId]) {
        acc[postId] = {
          post_id: comment.Post.post_id, 
          title: comment.Post.title, 
          description: comment.Post.description, 
          image: comment.Post.image, 
          comments: [], 
        };
      }

      // Ajouter le commentaire à l'entrée correspondante dans 'comments'
      acc[postId].comments.push({
        comment_id: comment.comment_id, 
        content: comment.content,
        created_at: comment.created_at, 
        user: {
          //Ajout des information de l'utilisateur ayant ecrit le commentaire
          user_id: comment.User.user_id, 
          email: comment.User.email, 
        },
      });

      return acc; // Retourner l'accumulateur pour la prochaine itération
    }, {});

    // Convertir l'objet regroupé en un tableau d'objets
    const result = Object.values(groupedComments);

    // Retourne la réponse avec la listes des posts et leurs commentaires
    res.status(200).json(result);

  } catch (error) {
  
    console.error("Erreur lors de la récupération des commentaires :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des commentaires" });
  }
};

exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(`Récupération des commentaires pour le post ID : ${postId}`);

    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [
        {
          model: User,  // Assure-toi que le modèle User est correctement inclus
          attributes: ['username'],  // Inclure seulement le champ 'username' de User
        }
      ],
      order: [["created_at", "DESC"]],
    });

    if (!comments.length) {
      return res
        .status(404)
        .json({ message: "Aucun commentaire trouvé pour ce post." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur dans getCommentsByPostId:", error.message);
    res.status(500).json({
      error: `Erreur serveur lors de la récupération des commentaires. ${error.message}`,
    });
  }
};

exports.modifyComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const userId = req.auth.userId; 

    
    const comment = await Comment.findOne({
      where: { comment_id: commentId },
      include: [{ model: Post, attributes: ["user_id"] }], // j'inclus le post pour vérifier l'auteur
    });

    
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    
    const isAdmin = req.auth.roles.includes("admin");
    const isAuthor = comment.user_id === userId; //auteur du commentaire

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
      });
    }

    //Verification du contenu
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: "Le contenu du commentaire ne peut pas être vide",
      });
    }

   
    await comment.update({
      content: content.trim(),
      updated_at: new Date(),
    });

    res.status(200).json({
      message: "Commentaire modifié avec succès",
      comment: {
        id: comment.comment_id,
        content: comment.content,
        updated_at: comment.updated_at,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la modification du commentaire:", error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la modification du commentaire",
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.auth.userId;
    const userRoles = req.auth.roles;

    //Recherche du commentaire avec son auteur
    const comment = await Comment.findOne({
      where: { comment_id: commentId },
      include: [{ model: Post, attributes: ["user_id"] }],
    });

    if (!comment) {
      return res.status(404).json({ error: "Commentaire non trouvé." });
    }

    //Verification des droits
    const isAdmin = userRoles.includes("admin");
    const isCommentAuthor = comment.user_id === userId;

    if (!isAdmin && !isCommentAuthor) {
      return res.status(403).json({
        error: "Vous n'êtes pas autorisé à supprimer ce commentaire.",
      });
    }

    await comment.destroy();
    res.status(200).json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    res.status(500).json({ error: "Erreur serveur lors de la suppression." });
  }
};
