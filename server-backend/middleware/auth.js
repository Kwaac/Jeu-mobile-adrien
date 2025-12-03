const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware d'authentification JWT
 * Vérifie le token et attache l'utilisateur à req.user
 */
const protect = async (req, res, next) => {
    let token;

    // Vérifier si le token est dans le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraire le token
            token = req.headers.authorization.split(' ')[1];

            // Vérifier et décoder le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupérer l'utilisateur (sans le password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Accès non autorisé - Token manquant'
        });
    }
};

/**
 * Génère un JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

module.exports = { protect, generateToken };
