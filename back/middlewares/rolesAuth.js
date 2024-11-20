const User = require('../models/users.model');
const Comments = require('../models/comments.model'); // Assurez-vous que le chemin est correct
const Posts = require('../models/posts.model')


// Middleware pour vérifier les rôles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.auth?.roles) {
      return res.status(403).json({
        message: 'Roles non définis pour l\'utilisateur'
      });

    }
    

    const hasRole = req.auth.roles.some(role => allowedRoles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({
        message: 'Accès refusé, votre rôle ne permet pas cette action.'
      });
    }
    console.log('Rôles requis:', allowedRoles);
    console.log('Rôles utilisateur:', req.auth.roles);
    
    next();
  };
};

// const verifyOwnership = (getUserIdFromRequest) => {
//   return async (req, res, next) => {
//     try {
//       // Vérification de la validité de l'ID du post
//       const post = await Posts.findByPk(req.params.postId, {
//         attributes: ['user_id'],
//         raw: true,
//       });

//       if (!post) {
//         return res.status(404).json({ message: 'Post non trouvé' });
//       }

//       console.log('Détails de vérification:', {
//         requestUserId: req.auth.userId,
//         postUserId: post.user_id,
//         userRoles: req.auth.roles,
//       });

//       const isOwner = req.auth.userId === post.user_id;
//       const isAdmin = req.auth.roles.includes('admin');

//       if (!isOwner && !isAdmin) {
//         return res.status(403).json({
//           message: 'Accès refusé. Vous ne pouvez pas modifier ce post.',
//         });
//       }

//       next();

//     } catch (error) {
//       console.error('Erreur lors de la vérification:', error);
//       return res.status(500).json({
//         message: 'Erreur lors de la vérification de la propriété du post.',
//       });
//     }
//   };
// };
const verifyOwnership = (getUserIdFromRequest) => {
  return async (req, res, next) => {
      try {
          // Utilisation du modèle Comments pour les commentaires
          const comment = await Comments.findByPk(req.params.commentId, {
              attributes: ['user_id'],
              raw: true,
          });

          if (!comment) {
              return res.status(404).json({ message: 'Commentaire non trouvé' });
          }

          console.log('Détails de vérification:', {
              requestUserId: req.auth.userId,
              commentUserId: comment.user_id,
              userRoles: req.auth.roles,
          });

          const isOwner = req.auth.userId === comment.user_id;
          const isAdmin = req.auth.roles.includes('admin');

          if (!isOwner && !isAdmin) {
              return res.status(403).json({
                  message: 'Accès refusé. Vous ne pouvez pas modifier ce commentaire.',
              });
          }

          next();
      } catch (error) {
          console.error('Erreur lors de la vérification:', error);
          return res.status(500).json({
              message: 'Erreur serveur lors de la vérification de la propriété du commentaire.',
          });
      }
  };
};




module.exports = {
  authorizeRoles,
  verifyOwnership
};