const User = require('../models/users.model');
const Posts = require('../models/posts.model');


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
//Middleware pour vérifier les proprietaire des ressources


// const verifyOwnership = () => {
//   return async (req, res, next) => {
//     try {
//       // Recherche du post par son ID
//       const resource = await Posts.findByPk(req.params.id);

//       if (!resource) {
//         return res.status(404).json({ message: 'Post non trouvé.' });
//       }

//       // Vérification si l'utilisateur est propriétaire ou administrateur
//       const isOwner = req.auth.userId === resource.user_id;  // Utilisation de 'user_id' du post
//       const isAdmin = req.auth.roles.includes('admin');

//       if (!isOwner && !isAdmin) {
//         return res.status(403).json({ message: 'Accès refusé.' });
//       }

//       next();  // L'utilisateur est autorisé à continuer
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Erreur serveur' });
//     }
//   };
// };
// const verifyOwnership = (getResourceFn) => {
//   return async (req, res, next) => {
//     try {
//       // Appel de la fonction pour obtenir la ressource (post ou commentaire)
//       const resource = await getResourceFn(req);

//       if (!resource) {
//         return res.status(404).json({ message: 'Ressource non trouvée.' });
//       }

//       // Vérification si l'utilisateur est propriétaire ou administrateur
//       const isOwner = req.auth.userId === resource.user_id; // Vérifie le propriétaire
//       const isAdmin = req.auth.roles.includes('admin');

//       if (!isOwner && !isAdmin) {
//         return res.status(403).json({ message: 'Accès refusé.' });
//       }

//       next(); // Continue vers le contrôleur
//     } catch (error) {
//       console.error('Erreur dans verifyOwnership:', error);
//       res.status(500).json({ message: 'Erreur serveur' });
//     }
//   };
// };
const verifyOwnership = (getResource) => {
  return async (req, res, next) => {
    try {
      const resource = await getResource(req);
      
      if (!resource) {
        return res.status(404).json({ message: 'Ressource non trouvée.' });
      }

      const isOwner = req.auth.userId === resource.user_id; // Comparaison avec l'utilisateur connecté
      const isAdmin = req.auth.roles.includes('admin');

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Accès refusé.' });
      }

      next(); // Autorisation validée
    } catch (error) {
      console.error('Erreur dans verifyOwnership:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
};



module.exports = {
  authorizeRoles,
  verifyOwnership
};