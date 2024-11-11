const jwt = require('jsonwebtoken');

// Utilisation de la clé JWT de l'environnement ou valeur par défaut
const safetyKeyJwt = process.env.JWT_SECRET || 'safetyKeyJwt'; 

module.exports = (req, res, next) => {
    try {
        // Vérification de l'existence de l'en-tête Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès refusé, token manquant ou mal formaté.' });
        }

        // Extraction du token du header Authorization (format: "Bearer <token>")
        const token = authHeader.split(' ')[1];

        // Vérification du token JWT avec la clé secrète
        const decodedToken = jwt.verify(token, safetyKeyJwt);  // Utilisation de la clé correcte

        // Extraction de l'ID utilisateur à partir du token décodé
        const userId = decodedToken.userId;

        // Ajout de l'ID utilisateur à req.auth pour les requêtes futures
        req.auth = {
            userId: userId
        };

        // Passage au middleware ou route suivant
        next();
    } catch (error) {
        // Gestion d'erreurs : token manquant ou invalide
        let message = 'Token invalide ou manquant.';
        
        // Déterminer le type d'erreur JWT et retourner un message plus spécifique
        if (error.name === 'TokenExpiredError') {
            message = 'Le token a expiré.';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Le token est invalide.';
        } else if (error.name === 'NotBeforeError') {
            message = 'Le token n\'est pas encore valide.';
        }

        // Retourner un message d'erreur avec le type d'erreur spécifique
        res.status(401).json({ message, error: error.message });
    }
};
