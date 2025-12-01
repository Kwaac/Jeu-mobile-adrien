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
     * Calcule le bonus de stats selon le niveau
     * @param {number} nextLevel - Le niveau après upgrade
     * @param {string} statName - Nom de la stat (hp, atk, def, etc.)
     */
    getStatBonus(nextLevel, statName) {
        // Calculer le palier (1-2: tier 1, 3-4: tier 2, etc.)
        const tier = Math.ceil(nextLevel / 2);

        // HP : Pourcentage par paliers (10%, 12%, 14%, 16%, 18%)
        if (statName === 'hp') {
            const percentBonus = 0.08 + (tier * 0.02); // 10%, 12%, 14%, 16%, 18%
            return { type: 'percent', value: percentBonus };
        }

        // ATK/DEF : Bonus flat par paliers (+1, +2, +3, +4, +5)
        return { type: 'flat', value: tier };
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

        // Augmenter stats selon le type
        for (let stat in item.stats) {
            const bonus = this.getStatBonus(item.level, stat);

            if (bonus.type === 'percent') {
                // HP : Pourcentage par paliers
                item.stats[stat] = Math.floor(item.stats[stat] * (1 + bonus.value));
            } else {
                // ATK/DEF : +X flat
                item.stats[stat] += bonus.value;
            }
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
        const nextLevel = item.level + 1;

        for (let stat in nextStats) {
            const bonus = this.getStatBonus(nextLevel, stat);

            if (bonus.type === 'percent') {
                // HP : Pourcentage par paliers
                nextStats[stat] = Math.floor(nextStats[stat] * (1 + bonus.value));
            } else {
                // ATK/DEF : +X flat
                nextStats[stat] += bonus.value;
            }
        }

        return nextStats;
    }
}
