import { getStatsForRarity, RARITY_MULTIPLIERS } from '../data/UnitDatabase.js';

export default class EvolutionSystem {
    constructor(game) {
        this.game = game;
    }

    /**
     * Vérifie si une unité peut évoluer
     */
    canEvolve(unit) {
        return unit.canEvolve();
    }

    /**
     * Trouve les duplicatas d'une unité (même unitId, même rareté)
     */
    findDuplicates(unit) {
        const allUnits = this.game.partyManager.getAllUnits();
        return allUnits.filter(u =>
            u !== unit && // Pas l'unité elle-même
            u.unitId === unit.unitId &&
            u.currentRarity === unit.currentRarity
        );
    }

    /**
     * Vérifie si l'évolution est possible
     */
    canPerformEvolution(unit) {
        // Vérifier si l'unité peut évoluer
        if (!unit.canEvolve()) {
            return {
                possible: false,
                reason: 'Rang maximum atteint'
            };
        }

        // Vérifier les duplicatas (besoin de 2 pour évoluer)
        const duplicates = this.findDuplicates(unit);
        if (duplicates.length < 2) {
            return {
                possible: false,
                reason: `Besoin de 2 duplicatas (${duplicates.length}/2)`
            };
        }

        // Vérifier l'or
        const cost = unit.getEvolutionCost();
        if (this.game.economySystem.resources.gold < cost) {
            return {
                possible: false,
                reason: `Or insuffisant (${cost} requis)`
            };
        }

        return {
            possible: true,
            duplicates: duplicates.slice(0, 2), // On prend les 2 premiers
            cost: cost
        };
    }

    /**
     * Calcule les stats après évolution
     */
    getEvolutionPreview(unit) {
        if (!unit.canEvolve()) return null;

        const nextRarity = unit.currentRarity + 1;
        const newStats = getStatsForRarity(unit.unitId, nextRarity);

        return {
            currentRarity: unit.currentRarity,
            nextRarity: nextRarity,
            currentStats: {
                hp: unit.maxHp,
                atk: unit.atk,
                def: unit.def
            },
            nextStats: {
                hp: newStats.hp,
                atk: newStats.atk,
                def: newStats.def
            }
        };
    }

    /**
     * Effectue l'évolution
     */
    evolveUnit(unit, materialUnits) {
        // Vérifications finales
        const check = this.canPerformEvolution(unit);
        if (!check.possible) {
            console.error('Évolution impossible:', check.reason);
            return false;
        }

        // Vérifier que les matériaux sont valides
        if (!materialUnits || materialUnits.length !== 2) {
            console.error('2 matériaux requis');
            return false;
        }

        // Vérifier que les matériaux sont des duplicatas valides
        for (const material of materialUnits) {
            if (material.unitId !== unit.unitId || material.currentRarity !== unit.currentRarity) {
                console.error('Matériau invalide');
                return false;
            }
        }

        // Consommer l'or
        const cost = unit.getEvolutionCost();
        if (!this.game.economySystem.spendResource('gold', cost)) {
            console.error('Échec de la dépense d\'or');
            return false;
        }

        // Retirer les matériaux de l'inventaire
        for (const material of materialUnits) {
            this.game.partyManager.removeUnit(material);
        }

        // Augmenter la rareté
        const nextRarity = unit.currentRarity + 1;
        const newStats = getStatsForRarity(unit.unitId, nextRarity);

        // Mettre à jour l'unité
        unit.currentRarity = nextRarity;
        unit.rarity = nextRarity; // Alias
        unit.evolutionCount++;

        // Reset niveau à 1
        unit.level = 1;
        unit.xp = 0;
        unit.xpToNextLevel = unit.calculateXpToNextLevel();

        // Mettre à jour les stats de base
        unit.baseAtk = newStats.atk;
        unit.baseDef = newStats.def;
        unit.baseMaxHp = newStats.hp;

        // Appliquer les nouvelles stats
        unit.atk = newStats.atk;
        unit.def = newStats.def;
        unit.maxHp = newStats.hp;
        unit.hp = newStats.hp; // Full heal

        // Reset BB gauge
        unit.bbGauge = 0;

        console.log(`✨ ${unit.name} a évolué vers ${unit.getRarityStars()} !`);
        console.log(`Nouvelles stats: HP ${unit.hp}, ATK ${unit.atk}, DEF ${unit.def}`);

        return true;
    }

    /**
     * Obtient le coût d'évolution
     */
    getEvolutionCost(unit) {
        return unit.getEvolutionCost();
    }
}
