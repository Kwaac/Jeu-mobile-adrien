export default class BlacksmithSystem {
    constructor(game) {
        this.game = game;
        this.baseUpgradeCost = 100;
    }

    /**
     * Calcule le coût d'amélioration
     * @param {Equipment} item 
     */
    getUpgradeCost(item) {
        const nextLevel = item.level + 1;
        const goldCost = this.baseUpgradeCost * nextLevel;
        const requiresMaterial = item.level >= 1;

        return {
            gold: goldCost,
            requiresMaterial: requiresMaterial,
            materialLevel: item.level
        };
    }

    /**
     * Trouve les matériaux compatibles (Même ID, Même Niveau, Non Équipé)
     * @param {Equipment} targetItem 
     */
    findMaterials(targetItem) {
        return this.game.economySystem.inventory.filter(item =>
            item.id === targetItem.id &&
            item.level === targetItem.level &&
            item !== targetItem // Pas l'objet lui-même
        );
    }

    /**
     * Vérifie si l'amélioration est possible
     * @param {Equipment} item 
     * @param {Equipment} material (Optionnel)
     */
    canUpgrade(item, material = null) {
        if (item.level >= item.maxLevel) {
            return { possible: false, reason: "Niveau Max atteint" };
        }

        const cost = this.getUpgradeCost(item);

        if (this.game.economySystem.resources.gold < cost.gold) {
            return { possible: false, reason: "Pas assez d'or" };
        }

        if (cost.requiresMaterial) {
            if (!material) {
                return { possible: false, reason: "Matériau requis" };
            }
            if (material.id !== item.id || material.level !== item.level) {
                return { possible: false, reason: "Matériau invalide" };
            }
        }

        return { possible: true };
    }

    /**
     * Exécute l'amélioration
     * @param {Equipment} item 
     * @param {Equipment} material 
     */
    upgradeItem(item, material = null) {
        const check = this.canUpgrade(item, material);
        if (!check.possible) return false;

        const cost = this.getUpgradeCost(item);

        // Consommer Or
        this.game.economySystem.spendResource('gold', cost.gold);

        // Consommer Matériau
        if (cost.requiresMaterial && material) {
            this.game.economySystem.removeItem(material);
        }

        // Appliquer Upgrade
        item.level++;

        // Augmenter stats (+10% par niveau par rapport aux stats de base)
        // Note: Pour simplifier, on multiplie les stats actuelles par 1.1 ou on recalcule depuis la base ?
        // On va faire simple : Stats actuelles * 1.1
        for (let stat in item.stats) {
            item.stats[stat] = Math.floor(item.stats[stat] * 1.1);
        }

        console.log(`Upgrade réussi : ${item.name} +${item.level}`);
        return true;
    }

    /**
     * Prévisualisation des stats au prochain niveau
     * @param {Equipment} item 
     */
    getPreviewStats(item) {
        const nextStats = { ...item.stats };
        for (let stat in nextStats) {
            nextStats[stat] = Math.floor(nextStats[stat] * 1.1);
        }
        return nextStats;
    }
}
