// Middleware pour vérifier les rôles
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Assurez-vous que req.auth contient les informations du rôle de l'utilisateur
        if (!req.auth || !roles.includes(req.auth.roles)) {
            return res.status(403).json({ message: 'Accès refusé, rôle non autorisé.' });
        }
        next();
    };
};


// Exporte le middleware pour pouvoir l'utiliser dans d'autres fichiers
module.exports = authorizeRoles;
