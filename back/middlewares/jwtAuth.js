const jwt = require('jsonwebtoken');
// Utilisation de la clé JWT de l'environnement ou valeur par défaut
const safetyKeyJwt = process.env.JWT_SECRET || 'safetyKeyJwt';

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token manquant ou mal formaté.' });
        }

        const token = authHeader.split(' ')[1]; // Extrait le token du header
        
        // Vérification du token
        const decodedToken = jwt.verify(token, safetyKeyJwt);
        console.log('Token décodé:', decodedToken); // Debug
        
        const userId = decodedToken.userId;
        const userRoles = decodedToken.roles; // Changé de role à roles
        
        if (!userId ) {
            return res.status(400).json({ 
                message: "Identifiant de l'utilisateur ou rôles manquants dans le token." 
            });
        }
        
        // Ajoute userId et roles dans la requête
        req.auth = { 
            userId, 
            roles: userRoles // Changé de role à roles
        };
        
        console.log('req.auth:', req.auth); // Debug
        next();
        
    } catch (error) {
        let message = 'Token invalide ou manquant.';
        if (error.name === 'TokenExpiredError') {
            message = 'Le token a expiré.';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Le token est invalide.';
        }
        console.error('Erreur JWT:', error); // Debug
        res.status(401).json({ message, error: error.message });
    }
};