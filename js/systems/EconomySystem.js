import Equipment from '../items/Equipment.js';

export default class EconomySystem {
    constructor(game) {
        this.game = game;
        this.resources = {
            zel: 0,
            karma: 0,
            gems: 0
        };
        this.inventory = [];

        // Add dummy items
        this.addItem(new Equipment('sword1', 'Épée rouillée', 'Vieille épée', 'weapon', { atk: 5 }));
        this.addItem(new Equipment('armor1', 'Armure de cuir', 'Protection basique', 'armor', { def: 3 }));
        this.addItem(new Equipment('acc1', 'Anneau de Vie', 'Donne de la vitalité', 'accessory', { maxHp: 50 }));
    }

    addItem(item) {
        this.inventory.push(item);
        console.log(`Objet ajouté : ${item.name}`);
    }

    removeItem(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
            console.log(`Objet retiré : ${item.name}`);
            return true;
        }
        return false;
    }

    // Soft Currency (Earned in game)
    earnZel(amount) {
        this.resources.zel += amount;
        console.log(`Gagné ${amount} Zel. Total : ${this.resources.zel}`);
        this.updateUI();
    }

    // Hard Currency (Purchased)
    buyGems(amount) {
        this.resources.gems += amount;
        console.log(`Acheté ${amount} Gemmes. Total : ${this.resources.gems}`);
        this.updateUI();
    }

    // Generic spend method
    spendResource(type, amount) {
        if (this.resources[type] >= amount) {
            this.resources[type] -= amount;
            console.log(`Dépensé ${amount} ${type}. Restant : ${this.resources[type]}`);
            this.updateUI();
            return true;
        }
        console.log(`Pas assez de ${type}. Requis : ${amount}, Disponible : ${this.resources[type]}`);
        return false;
    }

    updateUI() {
        // Placeholder for UI update
        // In a real app, this would update DOM elements in #ui-layer
    }
}
