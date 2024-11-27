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