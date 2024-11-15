// Middleware pour vérifier si l'utilisateur est le propriétaire de la ressource
const verifyOwnership = (getUserIdFromRequest) => {
    return async (req, res, next) => {
        const userIdFromRequest = getUserIdFromRequest(req);

        // Vérifier si l'utilisateur est bien le propriétaire de la ressource
        try {
            const user = await User.findByPk(userIdFromRequest);

            if (!user || user.user_id !== req.auth.userId) {
                return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.' });
            }

            next();  // L'utilisateur est le propriétaire, continuer avec la requête
        } catch (error) {
            console.error('Erreur lors de la vérification de la propriété:', error);
            return res.status(500).json({ message: 'Erreur lors de la vérification de la propriété.' });
        }
    };
};

module.exports = verifyOwnership; 