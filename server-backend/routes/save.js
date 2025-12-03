const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const PlayerData = require('../models/PlayerData');

/**
 * @route   GET /api/save
 * @desc    Récupérer la sauvegarde cloud
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const playerData = await PlayerData.findOne({ playerId: req.user.playerId });

        if (!playerData) {
            return res.status(404).json({
                success: false,
                message: 'Aucune sauvegarde trouvée'
            });
        }

        res.json({
            success: true,
            data: {
                version: playerData.version,
                timestamp: playerData.metadata.lastSave,
                playerId: playerData.playerId,
                economy: playerData.economy,
                party: playerData.party,
                quests: playerData.quests,
                metadata: playerData.metadata
            }
        });

    } catch (error) {
        console.error('Get save error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la sauvegarde'
        });
    }
});

/**
 * @route   POST /api/save
 * @desc    Sauvegarder dans le cloud
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const { version, economy, party, quests, metadata } = req.body;

        // Trouver ou créer la sauvegarde
        let playerData = await PlayerData.findOne({ playerId: req.user.playerId });

        if (!playerData) {
            // Créer nouvelle sauvegarde
            playerData = await PlayerData.create({
                playerId: req.user.playerId,
                version,
                economy,
                party,
                quests,
                metadata
            });
        } else {
            // Mettre à jour sauvegarde existante
            playerData.version = version || playerData.version;
            playerData.economy = economy || playerData.economy;
            playerData.party = party || playerData.party;
            playerData.quests = quests || playerData.quests;
            playerData.metadata = metadata || playerData.metadata;
            playerData.metadata.lastSave = Date.now();

            await playerData.save();
        }

        // Mettre à jour l'équipe PVP
        playerData.updatePVPTeam();
        await playerData.save();

        res.json({
            success: true,
            message: 'Sauvegarde cloud réussie',
            data: {
                timestamp: playerData.metadata.lastSave,
                version: playerData.version
            }
        });

    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la sauvegarde cloud'
        });
    }
});

/**
 * @route   POST /api/save/merge
 * @desc    Merger sauvegarde locale et cloud (résolution de conflits)
 * @access  Private
 */
router.post('/merge', protect, async (req, res) => {
    try {
        const { localSave } = req.body;

        const cloudSave = await PlayerData.findOne({ playerId: req.user.playerId });

        if (!cloudSave) {
            // Pas de sauvegarde cloud, utiliser la locale
            return res.json({
                success: true,
                action: 'use_local',
                message: 'Aucune sauvegarde cloud, utilisation de la sauvegarde locale'
            });
        }

        // Comparer les timestamps
        const localTimestamp = new Date(localSave.timestamp);
        const cloudTimestamp = new Date(cloudSave.metadata.lastSave);

        if (localTimestamp > cloudTimestamp) {
            // Local plus récent
            return res.json({
                success: true,
                action: 'use_local',
                message: 'Sauvegarde locale plus récente',
                cloudTimestamp: cloudTimestamp
            });
        } else {
            // Cloud plus récent
            return res.json({
                success: true,
                action: 'use_cloud',
                message: 'Sauvegarde cloud plus récente',
                data: {
                    version: cloudSave.version,
                    timestamp: cloudSave.metadata.lastSave,
                    economy: cloudSave.economy,
                    party: cloudSave.party,
                    quests: cloudSave.quests,
                    metadata: cloudSave.metadata
                }
            });
        }

    } catch (error) {
        console.error('Merge error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du merge des sauvegardes'
        });
    }
});

module.exports = router;
