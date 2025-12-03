import {
    BUILDING_DATABASE,
    getUpgradeCost,
    getUpgradeTime,
    getProduction,
    getCapacity,
    getMaxAllowedLevel,
    getAllBuildingIds
} from '../data/BuildingDatabase.js';

export default class VillageSystem {
    constructor(game) {
        this.game = game;

        // État des bâtiments
        this.buildings = {};

        // Initialiser tous les bâtiments au niveau 0 (non construits)
        getAllBuildingIds().forEach(id => {
            this.buildings[id] = {
                id: id,
                level: 0,
                isUpgrading: false,
                upgradeStartTime: null,
                upgradeEndTime: null,
                lastCollectTime: Date.now(),
                storedResources: 0
            };
        });

        // Construire l'Hôtel de Ville niveau 1 par défaut
        this.buildings.town_hall.level = 1;
        this.buildings.town_hall.lastCollectTime = Date.now();

        console.log('[VillageSystem] Village initialized');
    }

    /**
     * Démarre l'amélioration d'un bâtiment
     * @param {string} buildingId - ID du bâtiment
     * @returns {boolean} Succès ou échec
     */
    upgradeBuilding(buildingId) {
        const buildingState = this.buildings[buildingId];
        if (!buildingState) {
            console.log(`Bâtiment inconnu : ${buildingId}`);
            return false;
        }

        const buildingData = BUILDING_DATABASE[buildingId];
        const currentLevel = buildingState.level;

        // Vérifications
        if (buildingState.isUpgrading) {
            console.log(`${buildingData.name} est déjà en cours d'amélioration`);
            return false;
        }

        if (currentLevel >= buildingData.maxLevel) {
            console.log(`${buildingData.name} est déjà au niveau maximum`);
            return false;
        }

        // Vérifier le niveau de l'Hôtel de Ville
        const townHallLevel = this.buildings.town_hall.level;
        const maxAllowed = getMaxAllowedLevel(townHallLevel);

        if (buildingId !== 'town_hall' && currentLevel >= maxAllowed) {
            console.log(`${buildingData.name} nécessite un Hôtel de Ville de niveau ${currentLevel + 1}`);
            return false;
        }

        // Vérifier les ressources
        const cost = getUpgradeCost(buildingId, currentLevel);
        if (!this.hasEnoughResources(cost)) {
            console.log(`Ressources insuffisantes pour améliorer ${buildingData.name}`);
            console.log('Requis:', cost);
            console.log('Disponible:', this.game.economySystem.resources);
            return false;
        }

        // Dépenser les ressources
        this.game.economySystem.resources.gold -= cost.gold;
        this.game.economySystem.resources.crystals -= cost.crystals;
        this.game.economySystem.resources.essences -= cost.essences;

        // Démarrer l'amélioration
        const upgradeTime = getUpgradeTime(buildingId, currentLevel);
        const now = Date.now();

        buildingState.isUpgrading = true;
        buildingState.upgradeStartTime = now;
        buildingState.upgradeEndTime = now + (upgradeTime * 1000);

        console.log(`🏗️ ${buildingData.name} amélioration vers niveau ${currentLevel + 1} démarrée (${upgradeTime}s)`);

        this.game.economySystem.updateUI();
        return true;
    }

    /**
     * Vérifie si le joueur a assez de ressources
     * @param {Object} cost - Coût requis
     * @returns {boolean}
     */
    hasEnoughResources(cost) {
        const resources = this.game.economySystem.resources;
        return resources.gold >= cost.gold &&
            resources.crystals >= cost.crystals &&
            resources.essences >= cost.essences;
    }

    /**
     * Collecte les ressources générées par un bâtiment
     * @param {string} buildingId - ID du bâtiment
     * @returns {number} Quantité collectée
     */
    collectResources(buildingId) {
        const buildingState = this.buildings[buildingId];
        const buildingData = BUILDING_DATABASE[buildingId];

        if (!buildingState || buildingState.level === 0) {
            console.log('Bâtiment non construit');
            return 0;
        }

        if (buildingData.benefits.type !== 'production') {
            console.log('Ce bâtiment ne produit pas de ressources');
            return 0;
        }

        // Calculer les ressources générées
        const generated = this.calculateGeneratedResources(buildingId);

        if (generated === 0) {
            console.log('Aucune ressource à collecter');
            return 0;
        }

        // Ajouter les ressources au joueur
        const resourceType = buildingData.benefits.resource;
        this.game.economySystem.resources[resourceType] += generated;

        // Réinitialiser le stockage et le timer
        buildingState.storedResources = 0;
        buildingState.lastCollectTime = Date.now();

        console.log(`💰 Collecté ${generated} ${resourceType} de ${buildingData.name}`);
        this.game.economySystem.updateUI();

        return generated;
    }

    /**
     * Calcule les ressources générées depuis la dernière collecte
     * @param {string} buildingId - ID du bâtiment
     * @returns {number} Quantité générée
     */
    calculateGeneratedResources(buildingId) {
        const buildingState = this.buildings[buildingId];
        const buildingData = BUILDING_DATABASE[buildingId];

        if (buildingData.benefits.type !== 'production') return 0;

        const now = Date.now();
        const timeSinceLastCollect = (now - buildingState.lastCollectTime) / 1000; // en secondes
        const hoursElapsed = timeSinceLastCollect / 3600;

        const productionRate = getProduction(buildingId, buildingState.level);
        const capacity = getCapacity(buildingId, buildingState.level);

        const generated = Math.floor(hoursElapsed * productionRate);
        const toCollect = Math.min(generated, capacity);

        return toCollect;
    }

    /**
     * Retourne le niveau d'un bâtiment
     * @param {string} buildingId - ID du bâtiment
     * @returns {number} Niveau du bâtiment
     */
    getBuildingLevel(buildingId) {
        return this.buildings[buildingId]?.level || 0;
    }

    /**
     * Vérifie si un bâtiment peut être amélioré
     * @param {string} buildingId - ID du bâtiment
     * @returns {boolean}
     */
    canUpgradeBuilding(buildingId) {
        const buildingState = this.buildings[buildingId];
        const buildingData = BUILDING_DATABASE[buildingId];

        if (!buildingState || !buildingData) return false;
        if (buildingState.isUpgrading) return false;
        if (buildingState.level >= buildingData.maxLevel) return false;

        const townHallLevel = this.buildings.town_hall.level;
        const maxAllowed = getMaxAllowedLevel(townHallLevel);

        if (buildingId !== 'town_hall' && buildingState.level >= maxAllowed) {
            return false;
        }

        const cost = getUpgradeCost(buildingId, buildingState.level);
        return this.hasEnoughResources(cost);
    }

    /**
     * Met à jour les timers de construction
     * @param {number} deltaTime - Temps écoulé en ms
     */
    update(deltaTime) {
        const now = Date.now();

        // Vérifier les bâtiments en cours d'amélioration
        for (let buildingId in this.buildings) {
            const buildingState = this.buildings[buildingId];

            if (buildingState.isUpgrading && now >= buildingState.upgradeEndTime) {
                // Amélioration terminée
                buildingState.level++;
                buildingState.isUpgrading = false;
                buildingState.upgradeStartTime = null;
                buildingState.upgradeEndTime = null;

                const buildingData = BUILDING_DATABASE[buildingId];
                console.log(`✅ ${buildingData.name} amélioré au niveau ${buildingState.level} !`);

                // Notifier l'UI si elle existe
                if (this.game.uiManager) {
                    this.game.uiManager.showNotification(`${buildingData.icon} ${buildingData.name} niveau ${buildingState.level} !`);
                }
            }
        }
    }

    /**
     * Retourne le temps restant pour une amélioration en secondes
     * @param {string} buildingId - ID du bâtiment
     * @returns {number} Temps restant en secondes
     */
    getRemainingUpgradeTime(buildingId) {
        const buildingState = this.buildings[buildingId];
        if (!buildingState || !buildingState.isUpgrading) return 0;

        const now = Date.now();
        const remaining = Math.max(0, buildingState.upgradeEndTime - now);
        return Math.ceil(remaining / 1000);
    }

    /**
     * Sérialise l'état du village pour la sauvegarde
     * @returns {Object}
     */
    toJSON() {
        return {
            buildings: { ...this.buildings }
        };
    }

    /**
     * Restaure l'état du village depuis une sauvegarde
     * @param {Object} data - Données sauvegardées
     */
    fromJSON(data) {
        if (!data || !data.buildings) return;

        this.buildings = { ...data.buildings };
        console.log('[VillageSystem] State restored from save');
    }
}
