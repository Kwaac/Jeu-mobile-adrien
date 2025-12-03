const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const PlayerData = require('../models/PlayerData');

/**
 * @route   GET /api/pvp/matchmaking
 * @desc    Trouver un adversaire pour PVP asynchrone
 * @access  Private
 */
router.get('/matchmaking', protect, async (req, res) => {
    try {
        const currentUser = req.user;
        const currentRating = currentUser.pvpStats.rating;

        // Plage de rating pour le matchmaking (±200 points)
        const ratingRange = 200;

        // Trouver des adversaires potentiels
        const opponents = await User.find({
            _id: { $ne: currentUser._id }, // Pas soi-même
            'pvpStats.rating': {
                $gte: currentRating - ratingRange,
                $lte: currentRating + ratingRange
            }
        }).limit(10);

        if (opponents.length === 0) {
            // Si aucun adversaire dans la plage, prendre n'importe qui
            const anyOpponents = await User.find({
                _id: { $ne: currentUser._id }
            }).limit(10);

            if (anyOpponents.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Aucun adversaire disponible'
                });
            }

            opponents.push(...anyOpponents);
        }

        // Choisir un adversaire aléatoire
        const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];

        // Récupérer l'équipe de l'adversaire
        const opponentData = await PlayerData.findOne({ playerId: randomOpponent.playerId });

        if (!opponentData) {
            return res.status(404).json({
                success: false,
                message: 'Données de l\'adversaire non trouvées'
            });
        }

        const opponentTeam = opponentData.getPVPTeam();

        res.json({
            success: true,
            data: {
                opponent: {
                    username: randomOpponent.username,
                    playerId: randomOpponent.playerId,
                    rating: randomOpponent.pvpStats.rating,
                    wins: randomOpponent.pvpStats.wins,
                    losses: randomOpponent.pvpStats.losses
                },
                team: opponentTeam
            }
        });

    } catch (error) {
        console.error('Matchmaking error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du matchmaking'
        });
    }
});

/**
 * @route   POST /api/pvp/battle-result
 * @desc    Soumettre le résultat d'un combat PVP
 * @access  Private
 */
router.post('/battle-result', protect, async (req, res) => {
    try {
        const { opponentPlayerId, result, battleLog } = req.body;

        // result: 'win', 'loss', 'draw'
        if (!['win', 'loss', 'draw'].includes(result)) {
            return res.status(400).json({
                success: false,
                message: 'Résultat invalide (win/loss/draw)'
            });
        }

        const currentUser = req.user;
        const opponent = await User.findOne({ playerId: opponentPlayerId });

        if (!opponent) {
            return res.status(404).json({
                success: false,
                message: 'Adversaire non trouvé'
            });
        }

        // Calculer le changement de rating (système ELO simplifié)
        const K = 32; // Facteur K pour ELO
        const currentRating = currentUser.pvpStats.rating;
        const opponentRating = opponent.pvpStats.rating;

        // Probabilité de victoire attendue
        const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));

        // Score réel (1 = victoire, 0.5 = égalité, 0 = défaite)
        let actualScore;
        if (result === 'win') actualScore = 1;
        else if (result === 'draw') actualScore = 0.5;
        else actualScore = 0;

        // Changement de rating
        const ratingChange = Math.round(K * (actualScore - expectedScore));

        // Mettre à jour les stats du joueur
        currentUser.pvpStats.rating += ratingChange;
        currentUser.pvpStats.rating = Math.max(0, currentUser.pvpStats.rating); // Minimum 0

        if (result === 'win') {
            currentUser.pvpStats.wins += 1;
            currentUser.pvpStats.winStreak += 1;
        } else if (result === 'loss') {
            currentUser.pvpStats.losses += 1;
            currentUser.pvpStats.winStreak = 0;
        } else {
            currentUser.pvpStats.draws += 1;
        }

        // Mettre à jour le meilleur rating
        if (currentUser.pvpStats.rating > currentUser.pvpStats.bestRating) {
            currentUser.pvpStats.bestRating = currentUser.pvpStats.rating;
        }

        await currentUser.save();

        // Mettre à jour les stats de l'adversaire (inversé)
        const opponentRatingChange = -ratingChange;
        opponent.pvpStats.rating += opponentRatingChange;
        opponent.pvpStats.rating = Math.max(0, opponent.pvpStats.rating);

        if (result === 'win') {
            opponent.pvpStats.losses += 1;
            opponent.pvpStats.winStreak = 0;
        } else if (result === 'loss') {
            opponent.pvpStats.wins += 1;
            opponent.pvpStats.winStreak += 1;
        } else {
            opponent.pvpStats.draws += 1;
        }

        if (opponent.pvpStats.rating > opponent.pvpStats.bestRating) {
            opponent.pvpStats.bestRating = opponent.pvpStats.rating;
        }

        await opponent.save();

        // Calculer les récompenses
        const baseReward = 100;
        const rewardMultiplier = result === 'win' ? 1.5 : result === 'draw' ? 0.5 : 0.25;
        const zelReward = Math.round(baseReward * rewardMultiplier);
        const gemsReward = result === 'win' ? 5 : 0;

        res.json({
            success: true,
            message: `Combat terminé - ${result === 'win' ? 'Victoire' : result === 'loss' ? 'Défaite' : 'Égalité'}`,
            data: {
                result,
                ratingChange,
                newRating: currentUser.pvpStats.rating,
                rewards: {
                    zel: zelReward,
                    gems: gemsReward
                },
                stats: {
                    wins: currentUser.pvpStats.wins,
                    losses: currentUser.pvpStats.losses,
                    draws: currentUser.pvpStats.draws,
                    winStreak: currentUser.pvpStats.winStreak,
                    rating: currentUser.pvpStats.rating,
                    bestRating: currentUser.pvpStats.bestRating
                }
            }
        });

    } catch (error) {
        console.error('Battle result error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la soumission du résultat'
        });
    }
});

/**
 * @route   GET /api/pvp/leaderboard
 * @desc    Récupérer le classement PVP
 * @access  Private
 */
router.get('/leaderboard', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const leaderboard = await User.find()
            .sort({ 'pvpStats.rating': -1 })
            .limit(limit)
            .skip(skip)
            .select('username playerId pvpStats');

        const total = await User.countDocuments();

        // Trouver le rang du joueur actuel
        const currentUserRank = await User.countDocuments({
            'pvpStats.rating': { $gt: req.user.pvpStats.rating }
        }) + 1;

        res.json({
            success: true,
            data: {
                leaderboard: leaderboard.map((user, index) => ({
                    rank: skip + index + 1,
                    username: user.username,
                    playerId: user.playerId,
                    rating: user.pvpStats.rating,
                    wins: user.pvpStats.wins,
                    losses: user.pvpStats.losses,
                    winStreak: user.pvpStats.winStreak
                })),
                currentUserRank,
                totalPlayers: total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du classement'
        });
    }
});

module.exports = router;
