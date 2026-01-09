export default class BlacksmithSystem {
    constructor(game) {
        this.game = game;
    }

    /**
     * Calcule le coût d'amélioration (Level Up)
     * @param {Equipment} item 
     */
    getUpgradeCost(item) {
        const nextLevel = item.level + 1;
        // Coût : 100 * Niveau Suivant * Etoiles
        const goldCost = 100 * nextLevel * item.stars;

        return {
            gold: goldCost,
            requiresMaterial: false, // Pas de doublon pour le leveling 1-10
            materialLevel: 0
        };
    }

    /**
     * Trouve les matériaux compatibles (Legacy / Evolution only)
     */
    findMaterials(targetItem) {
        return []; // Pas utilisé pour le leveling standard
    }

    /**
     * Vérifie si l'amélioration est possible
     * @param {Equipment} item 
     */
    canUpgrade(item) {
        if (item.level >= 10) { // Hard cap au niveau 10
            return { possible: false, reason: "Niveau Max (10) atteint" };
        }

        const cost = this.getUpgradeCost(item);

        if (this.game.economySystem.resources.gold < cost.gold) {
            return { possible: false, reason: "Pas assez d'or" };
        }

        return { possible: true };
    }

    /**
     * Calcule le bonus de stats (Non utilisé directement, on recalcule tout)
     */
    getStatBonus(nextLevel, statName) {
        return { type: 'flat', value: 0 }; // Placeholder
    }

    /**
     * Exécute l'amélioration
     * @param {Equipment} item 
     */
    upgradeItem(item) {
        const check = this.canUpgrade(item);
        if (!check.possible) return false;

        const cost = this.getUpgradeCost(item);

        // Consommer Or
        this.game.economySystem.spendResource('gold', cost.gold);

        // Appliquer Upgrade
        const oldLevel = item.level;
        item.level++;

        // Recalculer les stats via la formule de Equipment.js
        if (item.calculateStats) {
            item.stats = item.calculateStats();
        }

        console.log(`Upgrade réussi : ${item.name} +${oldLevel} -> +${item.level}`);
        return true;
    }

    /**
     * Prévisualisation des stats au prochain niveau
     * @param {Equipment} item 
     */
    getPreviewStats(item) {
        // Simuler le niveau +1 sans modifier l'objet
        const currentLevel = item.level;
        item.level = currentLevel + 1;

        const nextStats = item.calculateStats ? item.calculateStats() : item.stats;

        // Rétablir
        item.level = currentLevel;
        item.calculateStats(); // Refresh just in case

        return nextStats;
    }
}
