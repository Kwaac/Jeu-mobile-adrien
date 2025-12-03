const mongoose = require('mongoose');

/**
 * Schéma PlayerData - Sauvegarde cloud du jeu
 * Structure identique à celle du SaveSystem côté client
 */
const PlayerDataSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true,
        unique: true,
        ref: 'User'
    },

    // Version de la sauvegarde (pour migrations)
    version: {
        type: String,
        default: '1.0.0'
    },

    // Données économiques
    economy: {
        resources: {
            zel: { type: Number, default: 0 },
            karma: { type: Number, default: 0 },
            gems: { type: Number, default: 0 },
            gold: { type: Number, default: 100000 }
        },
        inventory: [{
            id: String,
            name: String,
            description: String,
            slot: String,
            stats: mongoose.Schema.Types.Mixed,
            type: String
        }],
        maxInventorySize: { type: Number, default: 50 }
    },

    // Données de l'équipe
    party: {
        ownedUnits: [{
            instanceId: String,
            name: String,
            unitId: String,
            isPlayer: Boolean,

            // Stats
            hp: Number,
            maxHp: Number,
            atk: Number,
            def: Number,
            baseAtk: Number,
            baseDef: Number,
            baseMaxHp: Number,

            // Progression
            level: Number,
            xp: Number,
            xpToNextLevel: Number,

            // Rarity/Evolution
            baseRarity: Number,
            currentRarity: Number,
            maxRarity: Number,
            evolutionCount: Number,

            // Properties
            element: String,
            description: String,

            // BB
            bbGauge: Number,
            maxBbGauge: Number,

            // Equipment
            equipment: {
                weapon: mongoose.Schema.Types.Mixed,
                armor: mongoose.Schema.Types.Mixed,
                accessory: mongoose.Schema.Types.Mixed
            }
        }],
        partyInstanceIds: [String],
        selectedUnitId: String,
        maxPartySize: { type: Number, default: 5 }
    },

    // Progression des quêtes
    quests: {
        activeQuestId: String,
        currentWave: { type: Number, default: 0 }
    },

    // Métadonnées
    metadata: {
        lastSave: {
            type: Date,
            default: Date.now
        },
        gameState: {
            type: String,
            default: 'MENU'
        },
        totalPlayTime: {
            type: Number,
            default: 0
        }
    },

    // Pour PVP - équipe défensive (snapshot)
    pvpDefenseTeam: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }

}, {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// Index pour recherche rapide
PlayerDataSchema.index({ playerId: 1 });
PlayerDataSchema.index({ 'metadata.lastSave': -1 });

// Méthode pour obtenir l'équipe PVP
PlayerDataSchema.methods.getPVPTeam = function () {
    if (this.pvpDefenseTeam) {
        return this.pvpDefenseTeam;
    }

    // Si pas d'équipe défensive définie, utiliser l'équipe active
    const activeUnits = this.party.ownedUnits.filter(unit =>
        this.party.partyInstanceIds.includes(unit.instanceId)
    );

    return activeUnits;
};

// Méthode pour mettre à jour l'équipe PVP
PlayerDataSchema.methods.updatePVPTeam = function () {
    const activeUnits = this.party.ownedUnits.filter(unit =>
        this.party.partyInstanceIds.includes(unit.instanceId)
    );

    this.pvpDefenseTeam = activeUnits;
};

module.exports = mongoose.model('PlayerData', PlayerDataSchema);
