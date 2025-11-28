import Unit from '../entities/Unit.js';

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
        // Créer des unités de test
        const vargas = new Unit('Vargas', true, {
            hp: 120,
            atk: 18,
            def: 6,
            maxBbGauge: 20,
            element: 'fire',
            rarity: 5,
            description: 'Guerrier du feu légendaire'
        });

        const selena = new Unit('Selena', true, {
            hp: 110,
            atk: 15,
            def: 8,
            maxBbGauge: 25,
            element: 'water',
            rarity: 5,
            description: 'Maîtresse des eaux'
        });

        const lance = new Unit('Lance', true, {
            hp: 130,
            atk: 14,
            def: 10,
            maxBbGauge: 30,
            element: 'earth',
            rarity: 4,
            description: 'Protecteur de la terre'
        });

        const eze = new Unit('Eze', true, {
            hp: 100,
            atk: 20,
            def: 5,
            maxBbGauge: 22,
            element: 'thunder',
            rarity: 5,
            description: 'Maître de la foudre'
        });

        // Ajouter les unités
        this.addUnit(vargas);
        this.addUnit(selena);
        this.addUnit(lance);
        this.addUnit(eze);

        // Ajouter Vargas et Selena à l'équipe de combat
        this.addToParty(vargas);
        this.addToParty(selena);

        console.log('PartyManager initialisé avec 4 unités, 2 dans l\'équipe');
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

    getSelectedUnit() {
        return this.selectedUnit;
    }
}
