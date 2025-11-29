import Unit from '../entities/Unit.js';
import { getStatsForRarity } from '../data/UnitDatabase.js';

export default class PartyManager {
    constructor(game) {
        this.game = game;
        this.ownedUnits = []; // Toutes les unités possédées
        this.party = []; // Équipe de combat active (max 5)
        this.maxPartySize = 5;
        this.selectedUnit = null; // Unité actuellement sélectionnée dans l'UI

        this.initializeDefaultUnits();
    }

    initializeDefaultUnits() {
        // Créer des unités de test avec le nouveau système

        // 3x Chevalier de Feu 3★ (pour tester l'évolution)
        const fireKnight1 = new Unit('Chevalier de Feu', true, getStatsForRarity('fire_knight', 3));
        const fireKnight2 = new Unit('Chevalier de Feu', true, getStatsForRarity('fire_knight', 3));
        const fireKnight3 = new Unit('Chevalier de Feu', true, getStatsForRarity('fire_knight', 3));

        // 3x Mage Aquatique 3★ (pour tester l'évolution)
        const waterMage1 = new Unit('Mage Aquatique', true, getStatsForRarity('water_mage', 3));
        const waterMage2 = new Unit('Mage Aquatique', true, getStatsForRarity('water_mage', 3));
        const waterMage3 = new Unit('Mage Aquatique', true, getStatsForRarity('water_mage', 3));

        // 1x Guerrier Terrestre 4★
        const earthWarrior = new Unit('Guerrier Terrestre', true, getStatsForRarity('earth_warrior', 4));

        // 1x Paladin Lumineux 5★
        const lightPaladin = new Unit('Paladin Lumineux', true, getStatsForRarity('light_paladin', 5));

        // Ajouter les unités
        this.addUnit(fireKnight1);
        this.addUnit(fireKnight2);
        this.addUnit(fireKnight3);
        this.addUnit(waterMage1);
        this.addUnit(waterMage2);
        this.addUnit(waterMage3);
        this.addUnit(earthWarrior);
        this.addUnit(lightPaladin);

        // Ajouter à l'équipe de combat
        this.addToParty(fireKnight1);
        this.addToParty(waterMage1);
        this.addToParty(earthWarrior);

        console.log('PartyManager initialisé avec 8 unités (dont duplicatas pour test évolution)');
    }

    addUnit(unit) {
        if (!this.ownedUnits.includes(unit)) {
            this.ownedUnits.push(unit);
            console.log(`Unité ajoutée : ${unit.name}`);
        }
    }

    removeUnit(unit) {
        const index = this.ownedUnits.indexOf(unit);
        if (index > -1) {
            this.ownedUnits.splice(index, 1);
            this.removeFromParty(unit); // Retirer aussi de l'équipe si présent
            console.log(`Unité retirée : ${unit.name}`);
        }
    }

    addToParty(unit) {
        if (this.party.length >= this.maxPartySize) {
            console.log('Équipe complète ! Maximum 5 unités.');
            return false;
        }

        if (!this.ownedUnits.includes(unit)) {
            console.log('Cette unité n\'est pas possédée !');
            return false;
        }

        if (this.party.includes(unit)) {
            console.log(`${unit.name} est déjà dans l'équipe.`);
            return false;
        }

        this.party.push(unit);
        console.log(`${unit.name} ajouté à l'équipe de combat.`);
        return true;
    }

    removeFromParty(unit) {
        const index = this.party.indexOf(unit);
        if (index > -1) {
            this.party.splice(index, 1);
            console.log(`${unit.name} retiré de l'équipe de combat.`);
            return true;
        }
        return false;
    }

    isInParty(unit) {
        return this.party.includes(unit);
    }

    getParty() {
        return this.party;
    }

    getOwnedUnits() {
        return this.ownedUnits;
    }

    getUnitsNotInParty() {
        return this.ownedUnits.filter(unit => !this.isInParty(unit));
    }

    selectUnit(unit) {
        this.selectedUnit = unit;
        console.log(`Unité sélectionnée : ${unit.name}`);
    }

    getAllUnits() {
        return this.ownedUnits;
    }

    getSelectedUnit() {
        return this.selectedUnit;
    }
}
