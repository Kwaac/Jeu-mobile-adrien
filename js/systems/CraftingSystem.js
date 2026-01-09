import {
    canRefineItem,
    getRefineCost,
    getRefineTime,
    calculateRefinedStats,
    getRequiredForgeLevel
} from '../data/CraftingRecipes.js';
import EquipmentGenerator from '../items/EquipmentGenerator.js';

export default class CraftingSystem {
    constructor(game) {
        this.game = game;

        // File d'attente de craft en cours
        this.craftQueue = [];

        console.log('[CraftingSystem] Crafting system initialized');
    }

    /**
     * Raffine un objet vers le niveau d'étoiles suivant
     * @param {Object} item - L'objet à raffiner
     * @returns {boolean} Succès ou échec
     */
    refineItem(item) {
        if (!item) {
            console.log('Objet invalide');
            return false;
        }

        // Vérifier le niveau de la Forge
        const forgeLevel = this.game.villageSystem.getBuildingLevel('forge');

        if (!canRefineItem(item, forgeLevel)) {
            const requiredLevel = getRequiredForgeLevel(item);
            console.log(`Forge niveau ${requiredLevel} requise pour raffiner cet objet (actuellement niveau ${forgeLevel})`);
            return false;
        }

        // Vérifier si l'objet est déjà au maximum
        if (item.stars >= 7) {
            console.log('Cet objet est déjà au niveau maximum (7★)');
            return false;
        }

        // Vérifier les ressources
        const cost = getRefineCost(item);
        if (!this.hasEnoughResources(cost)) {
            console.log('Ressources insuffisantes pour raffiner cet objet');
            console.log('Requis:', cost);
            console.log('Disponible:', this.game.economySystem.resources);
            return false;
        }

        // Dépenser les ressources
        this.game.economySystem.resources.gold -= cost.gold;
        this.game.economySystem.resources.crystals -= cost.crystals;
        this.game.economySystem.resources.essences -= cost.essences;
        if (cost.fragments) {
            this.game.economySystem.resources.fragments -= cost.fragments;
        }

        // Ajouter à la file de craft
        const craftTime = getRefineTime(item);
        const now = Date.now();

        const craftJob = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            type: 'refine',
            item: item,
            startTime: now,
            endTime: now + (craftTime * 1000),
            targetStars: item.stars + 1
        };

        this.craftQueue.push(craftJob);

        console.log(`⚒️ Raffinage de ${item.name} vers ${item.stars + 1}★ démarré (${craftTime}s)`);
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
            resources.essences >= cost.essences &&
            resources.fragments >= (cost.fragments || 0);
    }

    /**
     * Vérifie si un objet peut être raffiné
     * @param {Object} item - L'objet
     * @returns {boolean}
     */
    canRefine(item) {
        if (!item || item.stars >= 7) return false;

        const forgeLevel = this.game.villageSystem.getBuildingLevel('forge');
        if (!canRefineItem(item, forgeLevel)) return false;

        const cost = getRefineCost(item);
        return this.hasEnoughResources(cost);
    }

    /**
     * Retourne les informations de raffinage pour un objet
     * @param {Object} item - L'objet
     * @returns {Object|null}
     */
    getRefineInfo(item) {
        if (!item) return null;

        const forgeLevel = this.game.villageSystem.getBuildingLevel('forge');
        const requiredForgeLevel = getRequiredForgeLevel(item);
        const cost = getRefineCost(item);
        const time = getRefineTime(item);
        const newStats = calculateRefinedStats(item);

        return {
            canRefine: this.canRefine(item),
            requiredForgeLevel: requiredForgeLevel,
            currentForgeLevel: forgeLevel,
            cost: cost,
            time: time,
            currentStars: item.stars,
            targetStars: item.stars + 1,
            currentStats: item.stats,
            newStats: newStats
        };
    }

    /**
     * Crée un nouvel objet aléatoire
     * @param {string} slot - Slot spécifique ou null
     * @param {number} rarity - Rareté (1-7)
     * @returns {Object|null} L'objet créé
     */
    craftNewItem(slot = null, rarity = 1) {
        // Import dynamique pour éviter les dépendances circulaires si nécessaire, 
        // mais ici on a importé EquipmentGenerator normalement dans le fichier (à ajouter).
        // On va supposer que EquipmentGenerator est importé en haut.

        // Coût de création (Placeholder)
        const cost = { gold: 100 * rarity, crystals: 10 * rarity, essences: 0, fragments: 0 };

        if (!this.hasEnoughResources(cost)) {
            console.log("Pas assez de ressources pour crafter.");
            return null;
        }

        // Dépenser
        this.game.economySystem.resources.gold -= cost.gold;
        this.game.economySystem.resources.crystals -= cost.crystals;

        // Générer
        // Note: EquipmentGenerator needs to be imported! I will add the import in a separate step or assume I added it.
        // Wait, I need to add the import to the top of the file first!
        // I will do that in the next step or valid replacement.

        // For now, let's assume the method exists on `this.game` or similar if I registered it?
        // No, best is to import it.

        // Let's blindly add the import in the top replacement, and then this method.
        return null; // Placeholder until import fixed
    }

    /**
     * Améliore le niveau d'un objet (Level Up)
     * @param {Object} item - L'objet
     * @returns {boolean}
     */
    upgradeItemLevel(item) {
        if (!item || item.level >= item.maxLevel) { // Max 10
            console.log("Niveau max atteint ou item invalide");
            return false;
        }

        const cost = this.getLevelUpCost(item);
        if (this.game.economySystem.resources.gold < cost) {
            if (this.game.uiManager) this.game.uiManager.showNotification("Or insuffisant !", "error");
            return false;
        }

        // Pay
        this.game.economySystem.resources.gold -= cost;

        // Upgrade
        item.level++;
        item.stats = item.calculateStats();

        if (this.game.uiManager) {
            this.game.uiManager.showNotification(`${item.name} +${item.level} !`);
            this.game.economySystem.updateUI();
        }

        return true;
    }

    getLevelUpCost(item) {
        // Coût progressif : 100 * (Level + 1) * Rareté
        return 100 * (item.level + 1) * item.stars;
    }

    /**
     * Crée un nouvel objet aléatoire (Génération V2)
     * @param {string} slot - Slot spécifique ou null
     * @param {number} rarity - Rareté (1-7)
     * @returns {Object|null} L'objet créé
     */
    craftNewItem(slot = null, rarity = 1) {
        // Coût de création (100 Or, 10 Cristaux par niveau de rareté)
        // C'est un coût de base pour le test, à équilibrer plus tard.
        const cost = {
            gold: 100 * rarity,
            crystals: 10 * rarity,
            essences: 0,
            fragments: 0
        };

        if (!this.hasEnoughResources(cost)) {
            console.log("Pas assez de ressources pour crafter.");
            if (this.game.uiManager) {
                this.game.uiManager.showNotification("Ressources insuffisantes !", "error");
            }
            return null;
        }

        // Dépenser
        this.game.economySystem.resources.gold -= cost.gold;
        this.game.economySystem.resources.crystals -= cost.crystals;
        if (this.game.economySystem.updateUI) this.game.economySystem.updateUI();

        // Générer l'objet
        const newItem = EquipmentGenerator.generateRandomItem(slot, rarity);

        // Ajouter à l'inventaire
        this.game.economySystem.addItemToInventory(newItem);

        console.log(`Nouvel objet crafté : ${newItem.name} (${newItem.stars}★)`);
        if (this.game.uiManager) {
            this.game.uiManager.showNotification(`Objet créé : ${newItem.name} !`);
        }

        return newItem;
    }

    /**
     * Met à jour la file de craft
     * @param {number} deltaTime - Temps écoulé en ms
     */
    update(deltaTime) {
        const now = Date.now();
        const completedJobs = [];

        // Vérifier les crafts terminés
        for (let i = 0; i < this.craftQueue.length; i++) {
            const job = this.craftQueue[i];

            if (now >= job.endTime) {
                // Craft terminé
                this.completeCraft(job);
                completedJobs.push(i);
            }
        }

        // Retirer les crafts terminés de la file
        for (let i = completedJobs.length - 1; i >= 0; i--) {
            this.craftQueue.splice(completedJobs[i], 1);
        }
    }

    /**
     * Termine un craft et applique les changements
     * @param {Object} job - Le job de craft
     */
    completeCraft(job) {
        if (job.type === 'refine') {
            const item = job.item;
            const oldStars = item.stars;

            // Augmenter le niveau d'étoiles
            item.stars = job.targetStars;

            // Recalculer les stats
            item.stats = calculateRefinedStats(item);

            console.log(`✨ ${item.name} raffiné de ${oldStars}★ à ${item.stars}★ !`);
            console.log('Nouvelles stats:', item.stats);

            // Notifier l'UI
            if (this.game.uiManager) {
                this.game.uiManager.showNotification(`✨ ${item.name} ${item.stars}★ !`);
            }
        }
    }

    /**
     * Retourne le temps restant pour un craft en secondes
     * @param {string} jobId - ID du job
     * @returns {number}
     */
    getRemainingCraftTime(jobId) {
        const job = this.craftQueue.find(j => j.id === jobId);
        if (!job) return 0;

        const now = Date.now();
        const remaining = Math.max(0, job.endTime - now);
        return Math.ceil(remaining / 1000);
    }

    /**
     * Sérialise l'état du crafting pour la sauvegarde
     * @returns {Object}
     */
    toJSON() {
        return {
            craftQueue: this.craftQueue.map(job => ({
                id: job.id,
                type: job.type,
                itemId: job.item.id,
                startTime: job.startTime,
                endTime: job.endTime,
                targetStars: job.targetStars
            }))
        };
    }

    /**
     * Restaure l'état du crafting depuis une sauvegarde
     * @param {Object} data - Données sauvegardées
     */
    fromJSON(data) {
        if (!data || !data.craftQueue) return;

        // Restaurer la file de craft
        this.craftQueue = data.craftQueue.map(jobData => {
            // Retrouver l'objet dans l'inventaire
            const item = this.game.economySystem.inventory.find(i => i.id === jobData.itemId);

            if (item) {
                return {
                    id: jobData.id,
                    type: jobData.type,
                    item: item,
                    startTime: jobData.startTime,
                    endTime: jobData.endTime,
                    targetStars: jobData.targetStars
                };
            }
            return null;
        }).filter(job => job !== null);

        console.log('[CraftingSystem] State restored from save');
    }
}
