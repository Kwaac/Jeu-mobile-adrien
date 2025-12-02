import Unit from '../entities/Unit.js';
import { getRandomUnit } from '../data/UnitDatabase.js';

export default class GachaSystem {
    constructor(game) {
        this.game = game;
        this.summonCost = 5; // Coût en gemmes
    }

    /**
     * Tente d'effectuer une invocation simple
     * @returns {Object} Résultat de l'invocation { success: boolean, unit: Unit, error: string }
     */
    summonSingle() {
        // 1. Vérifier les ressources
        if (this.game.economySystem.resources.gems < this.summonCost) {
            return {
                success: false,
                error: "Pas assez de gemmes !"
            };
        }

        // 2. Vérifier la place dans l'inventaire (Optionnel, mais bonne pratique)
        // Pour l'instant on suppose que l'inventaire est illimité ou géré par PartyManager

        // 3. Consommer les gemmes
        this.game.economySystem.spendResource('gems', this.summonCost);

        // 4. Tirage aléatoire
        const unitStats = getRandomUnit();

        // 5. Création de l'unité
        // On utilise 'true' pour isOwned car c'est une nouvelle unité du joueur
        const newUnit = new Unit(unitStats.name, true, unitStats);

        // 6. Ajout à l'inventaire
        this.game.partyManager.addUnit(newUnit);

        console.log(`[Gacha] Invocation réussie : ${newUnit.name} (${newUnit.getRarityStars()})`);

        return {
            success: true,
            unit: newUnit
        };
    }

    /**
     * Invocation multiple (10 invocations)
     * @returns {Object} Résultat { success: boolean, units: Unit[], error: string }
     */
    summonMulti() {
        const multiCost = this.summonCost * 10; // 50 gemmes

        // 1. Vérifier les ressources
        if (this.game.economySystem.resources.gems < multiCost) {
            return {
                success: false,
                error: "Pas assez de gemmes ! (50 gemmes requises)"
            };
        }

        // 2. Consommer les gemmes
        this.game.economySystem.spendResource('gems', multiCost);

        // 3. Effectuer 10 invocations
        const units = [];
        for (let i = 0; i < 10; i++) {
            const unitStats = getRandomUnit();
            const newUnit = new Unit(unitStats.name, true, unitStats);
            this.game.partyManager.addUnit(newUnit);
            units.push(newUnit);
        }

        console.log(`[Gacha] Invocation x10 réussie : ${units.length} héros obtenus`);

        return {
            success: true,
            units: units
        };
    }
}
