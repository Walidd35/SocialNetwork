const Comment = require('../models/comments.model');  // Assurez-vous que le modèle est bien importé
const Post  = require('../models/posts.model');  // Assurez-vous d'importer le modèle Post pour vérifier si le post existe
const User = require('../models/users.model')

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;  // Contenu du commentaire
    const postId = req.params.postId;  // ID du post auquel on veut ajouter un commentaire
    const userId = req.auth.userId;  // ID de l'utilisateur récupéré depuis le middleware d'authentification (via JWT)

    // Vérifier si le post existe
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    // Créer le commentaire
    const newComment = await Comment.create({
      content,  // Le contenu du commentaire
      post_id: postId,  // ID du post auquel ce commentaire appartient
      user_id: userId,  // ID de l'utilisateur qui a créé le commentaire
    });

    // Répondre avec le commentaire créé
    res.status(201).json({ message: 'Commentaire envoyée avec succès', commentaire : newComment });

  } catch (error) {
    console.error('Erreur lors de l/envoi du commentaire:', error);
    res.status(500).json({ error: 'Erreur lors de de l/envoi du commentaire' });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    // Récupérer tous les commentaires avec les informations de l'utilisateur et du post associé
    const comments = await Comment.findAll({
      include: [
        {
          model: User,  // Inclure les données de l'utilisateur associé au commentaire
          attributes: ['user_id', 'email'],  // Sélectionner seulement 'user_id' et 'email' pour l'utilisateur
        },
        {
          model: Post,  // Inclure les données du post associé au commentaire
          attributes: ['post_id', 'title', 'description', 'image'],  // Sélectionner 'post_id', 'title', 'description', 'image' pour le post
        },
      ],
    });

    // Regrouper les commentaires par post
    const groupedComments = comments.reduce((acc, comment) => {
      // Récupérer l'ID du post auquel appartient le commentaire
      const postId = comment.Post.post_id;
      
      // Si le post n'a pas encore été ajouté à l'accumulateur, l'ajouter
      if (!acc[postId]) {
        acc[postId] = {
          post_id: comment.Post.post_id,  // Ajouter l'ID du post
          title: comment.Post.title,  // Ajouter le titre du post
          description: comment.Post.description,  // Ajouter la description du post
          image: comment.Post.image,  // Ajouter l'image du post
          comments: [],  // Initialiser un tableau pour les commentaires de ce post
        };
      }

      // Ajouter le commentaire à l'entrée correspondante dans 'comments'
      acc[postId].comments.push({
        comment_id: comment.comment_id,  // Ajouter l'ID du commentaire
        content: comment.content,  // Ajouter le contenu du commentaire
        created_at: comment.created_at,  // Ajouter la date de création du commentaire
        user: {  // Ajouter les informations de l'utilisateur ayant écrit le commentaire
          user_id: comment.User.user_id,  // ID de l'utilisateur
          email: comment.User.email,  // Email de l'utilisateur
        },
      });

      return acc;  // Retourner l'accumulateur pour la prochaine itération
    }, {});

    // Convertir l'objet regroupé en un tableau d'objets
    const result = Object.values(groupedComments);

    // Retourner la réponse avec la liste des posts et leurs commentaires
    res.status(200).json(result);
  } catch (error) {
    // En cas d'erreur, l'afficher dans la console et retourner une réponse d'erreur avec un statut 500
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
};

// "exports.getCommentsByPostId = async (req, res) => {"
//   console.log('Début de getCommentsByPostId');
//   try {
//     const { postId } = req.params;
//     const userId = req.auth?.userId;
//     const userRoles = req.auth?.roles || [];

//     console.log(`Récupération des commentaires pour le postId ${postId}`);

//     // Vérifier si le post existe
//     const post = await Post.findByPk(postId);
//     if (!post) {
//       console.log(`Post avec l'ID ${postId} non trouvé`);
//       return res.status(404).json({ error: 'Post non trouvé' });
//     }

//     // Récupérer les commentaires associés au post
//     const comments = await Comment.findAll({
//       where: { post_id: postId },
//       include: [{
//         model: User,
//         attributes: ['user_id', 'username']
//       }],
//       order: [['created_at', 'DESC']]
//     });

//     // Ajouter des informations sur les droits de l'utilisateur pour chaque commentaire
//     const commentsWithPermissions = comments.map(comment => {
//       const isAdmin = userRoles.includes('admin');
//       const isCommentAuthor = comment.user_id === userId;
//       return {
//         ...comment.toJSON(),
//         canDelete: isAdmin || isCommentAuthor
//       };
//     });

//     console.log(`${comments.length} commentaires trouvés pour le post ${postId}`);
//     res.status(200).json(commentsWithPermissions);
//   } catch (error) {
//     console.error('Erreur dans getCommentsByPostId:', error);
//     res.status(500).json({ error: 'Erreur lors de la récupération des commentaires', details: error.message });
//   }
// };

// exports.getCommentById = async (req,res) => {

//   const {commentId} = req.params;

//   try{

//       const comment = await Comment.findByPk(commentId,{
//         include:[
//           {
//             model:User,
//             attributes: ['username','email'],
//           },
//           {
//             model:Post,
//             attributes:['post_id', 'title', 'description', 'image'],
//             include: [
//               {
//                 model:User,
//                 attributes:['email'],
//               },
//             ],
//           },
//         ],
//       });

//       //  Vérifier si le commentaire existe
//       if(!comment){
//         return res.status(404).json({message: 'Commentaire non trouvé'})
//       }

//       // Retourner le commentaire trouvé
//       res.status(200).json(comment);

//   }catch(error){
//     console.error("Erreur lors de la récuperation du commentaire:", error);
//     res.status(500).json({error: 'Erreur lors de la récupération du commentaire'});
//   }
// }

exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(`Récupération des commentaires pour le post ID: ${postId}`);

    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [{ model: User, attributes: ['username'] }],
      order: [['created_at', 'DESC']]
    });

    if (!comments.length) {
      return res.status(404).json({ message: 'Aucun commentaire trouvé pour ce post.' });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error('Erreur dans getCommentsByPostId:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des commentaires.' });
  }
};


exports.modifyComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const userId = req.auth.userId; // L'utilisateur connecté

    // Rechercher le commentaire
    const comment = await Comment.findOne({
      where: { comment_id: commentId },
      include: [{ model: Post, attributes: ['user_id'] }] // Inclure le Post pour vérifier l'auteur
    });

    // Vérifier si le commentaire existe
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // Vérification des droits
    const isAdmin = req.auth.roles.includes('admin');
    const isAuthor = comment.user_id === userId; // Auteur du commentaire

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à modifier ce commentaire",
      });
    }

    // Vérification du contenu
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: "Le contenu du commentaire ne peut pas être vide",
      });
    }

    // Mise à jour du commentaire
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

      // Rechercher le commentaire avec son auteur
      const comment = await Comment.findOne({
          where: { comment_id: commentId },
          include: [{ model: Post, attributes: ['user_id'] }]
      });

      if (!comment) {
          return res.status(404).json({ error: 'Commentaire non trouvé.' });
      }

      // Vérification des droits
      const isAdmin = userRoles.includes('admin');
      const isCommentAuthor = comment.user_id === userId;

      if (!isAdmin && !isCommentAuthor) {
          return res.status(403).json({ 
              error: 'Vous n\'êtes pas autorisé à supprimer ce commentaire.' 
          });
      }

      await comment.destroy();
      res.status(200).json({ message: 'Commentaire supprimé avec succès.' });

  } catch (error) {
      console.error('Erreur lors de la suppression du commentaire :', error);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
  }
};