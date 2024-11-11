// Middleware pour autoriser l'accès en fonction des rôles autorisés
const authorizeRoles = (...allowedRoles) => {
    // Retourne un middleware qui prend la requête, la réponse, et la fonction next
    return (req, res, next) => {
        
        // Vérifie si le rôle de l'utilisateur (stocké dans req.user.role) est inclus dans la liste des rôles autorisés
        if (!allowedRoles.includes(req.user.role)) {
            // Si le rôle n'est pas autorisé, renvoie une réponse avec le statut 403 (interdit) et un message d'erreur
            return res.status(403).json({ message: "Accès refusé" });
        }
        
        // Si le rôle est autorisé, passe à la prochaine fonction middleware ou au contrôleur de la route
        next();
    };
};

// Exporte le middleware pour pouvoir l'utiliser dans d'autres fichiers
module.exports = authorizeRoles;
