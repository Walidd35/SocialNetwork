// Middleware pour vérifier les rôles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Log pour le débogage
        console.log('Vérification des rôles :', {
            rolesAutorisés: allowedRoles,
            userAuth: req.auth,
            userRoles: req.auth?.roles
        });

        // Vérifie si req.auth existe
        if (!req.auth) {
            console.log('Authentification manquante');
            return res.status(401).json({ 
                message: 'Non authentifié' 
            });
        }

        // Vérifie si roles existe dans req.auth
        if (!req.auth.roles) {
            console.log('Roles manquants dans req.auth');
            return res.status(403).json({ 
                message: 'Roles non définis pour l\'utilisateur' 
            });
        }

        // Convertit les rôles en tableau s'ils ne le sont pas déjà
        const userRoles = Array.isArray(req.auth.roles) 
            ? req.auth.roles 
            : [req.auth.roles];

        // Vérifie si l'utilisateur a au moins un des rôles autorisés
        const hasAuthorizedRole = userRoles.some(role => 
            allowedRoles.includes(role)
        );

        console.log('Résultat de la vérification:', {
            userRoles,
            hasAuthorizedRole
        });

        if (!hasAuthorizedRole) {
            return res.status(403).json({ 
                message: 'Accès refusé, rôle non autorisé.',
                rolesRequis: allowedRoles,
                rolesUtilisateur: userRoles
            });
        }

        next();
    };
};

// Exporte le middleware pour pouvoir l'utiliser dans d'autres fichiers
module.exports = authorizeRoles;