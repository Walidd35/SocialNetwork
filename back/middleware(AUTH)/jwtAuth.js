const jwt = require('jsonwebtoken');
const safetyKeyJwt = process.env.JWT_SECRET; 

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // Vérifie que le token existe
        if (!token) {
            return res.status(401).json({ error: 'Token manquant !' });
        }

        // Vérifie et décode le token
        const decodedToken = jwt.verify(token, safetyKeyJwt);
        const userId = decodedToken.userId; // Corrected from user_id to userId

        // Ajoute l'identifiant utilisateur à la requête
        req.auth = {
            userId: userId // Use the correctly defined userId
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Requête invalide !' }); // Updated the error message
    }
};
