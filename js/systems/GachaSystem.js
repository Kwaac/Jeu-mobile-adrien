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
     * Invocation multiple (10 invocations) - Placeholder
     */
    summonMulti() {
        // À implémenter plus tard
        return { success: false, error: "Non implémenté" };
    }
}
