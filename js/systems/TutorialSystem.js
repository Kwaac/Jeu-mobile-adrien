
import { getRandomUnit, getStatsForRarity } from '../data/UnitDatabase.js';
import Unit from '../entities/Unit.js';

export default class TutorialSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
    }

    checkStarter() {
        // If player has 0 units and 0 party members, it's a fresh start.
        if (this.game.partyManager.getOwnedUnits().length === 0) {
            console.log("[Tutorial] First time detected! Triggering First Summon.");
            this.startFirstSummonSequence();
        }
    }

    startFirstSummonSequence() {
        this.active = true;

        // Show a simple modal or alert explaining the situation
        // Ideally we use UIManager, but for now simple alerts or direct DOM manipulation
        alert("Bienvenue, Élu !\nL'Arbre Monde se meurt... Vous devez invoquer votre premier héros pour le protéger.");

        // Force a summon
        this.performFirstSummon();
    }

    performFirstSummon() {
        console.log("[Tutorial] Performing Free First Summon...");

        // Custom logic: Get a GUARANTEED 3-Star Unit, but random from the database
        // We filter for 3 stars
        let starterStats = null;
        let attempts = 0;

        while (!starterStats && attempts < 100) {
            // Get random unit
            const candidate = getRandomUnit();
            if (candidate.baseRarity === 3) {
                starterStats = candidate;
            }
            attempts++;
        }

        // Fallback if random fails (unlikely with 90 units)
        if (!starterStats) {
            starterStats = getStatsForRarity('fire_warrior_1', 3); // Fallback to a basic unit
        }

        // Create Unit
        const newUnit = new Unit(starterStats.name, true, starterStats);

        // Add to Party
        this.game.partyManager.addUnit(newUnit);
        this.game.partyManager.addToParty(newUnit);
        this.game.partyManager.saveUnitPosition(newUnit, 2); // Center Front

        // Feedback
        alert(`🌟 INVOCATION RÉUSSIE !\n\nVous avez obtenu : ${newUnit.name} (3★)\nClasse : ${newUnit.class}\nÉlément : ${newUnit.element.toUpperCase()}`);

        // Give some starter resources
        this.game.economySystem.earnGold(500);
        this.game.economySystem.earnResource('gems', 10); // Not enough for another summon (50)

        this.active = false;

        console.log("[Tutorial] First Summon Complete. Unit added to party.");

        // Save immediately
        this.game.saveSystem.save();
    }
}
