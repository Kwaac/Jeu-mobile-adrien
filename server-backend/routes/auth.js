const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const PlayerData = require('../models/PlayerData');
const { generateToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Créer un nouveau compte
 * @access  Public
 */
router.post('/register', [
    body('username').trim().isLength({ min: 3, max: 20 }).withMessage('Username: 3-20 caractères'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Password: minimum 6 caractères'),
    body('playerId').notEmpty().withMessage('Player ID requis')
], async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, email, password, playerId } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ $or: [{ email }, { username }, { playerId }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Username, email ou player ID déjà utilisé'
            });
        }

        // Créer l'utilisateur
        const user = await User.create({
            username,
            email,
            password,
            playerId
        });

        // Créer la sauvegarde vide
        await PlayerData.create({
            playerId: user.playerId,
            version: '1.0.0'
        });

        // Générer le token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Compte créé avec succès',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    playerId: user.playerId,
                    pvpStats: user.pvpStats
                }
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création du compte'
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Connexion
 * @access  Public
 */
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Password requis')
], async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Trouver l'utilisateur (avec le password cette fois)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou password incorrect'
            });
        }

        // Vérifier le password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email ou password incorrect'
            });
        }

        // Mettre à jour lastLogin et isOnline
        user.lastLogin = Date.now();
        user.isOnline = true;
        await user.save();

        // Générer le token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    playerId: user.playerId,
                    pvpStats: user.pvpStats,
                    lastLogin: user.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion'
        });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion (marquer offline)
 * @access  Private
 */
router.post('/logout', async (req, res) => {
    try {
        // Note: En JWT, la déconnexion est gérée côté client (suppression du token)
        // Ici on marque juste l'utilisateur comme offline

        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la déconnexion'
        });
    }
});

module.exports = router;
