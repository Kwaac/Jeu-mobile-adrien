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
        this.addItem(new Equipment('sword1', 'Rusty Sword', 'Old sword', 'weapon', { atk: 5 }));
        this.addItem(new Equipment('armor1', 'Leather Armor', 'Basic protection', 'armor', { def: 3 }));
    }

    addItem(item) {
        this.inventory.push(item);
        console.log(`Added item: ${item.name}`);
    }

    // Soft Currency (Earned in game)
    earnZel(amount) {
        this.resources.zel += amount;
        console.log(`Earned ${amount} Zel. Total: ${this.resources.zel}`);
        this.updateUI();
    }

    // Hard Currency (Purchased)
    buyGems(amount) {
        this.resources.gems += amount;
        console.log(`Purchased ${amount} Gems. Total: ${this.resources.gems}`);
        this.updateUI();
    }

    // Generic spend method
    spendResource(type, amount) {
        if (this.resources[type] >= amount) {
            this.resources[type] -= amount;
            console.log(`Spent ${amount} ${type}. Remaining: ${this.resources[type]}`);
            this.updateUI();
            return true;
        }
        console.log(`Not enough ${type}. Required: ${amount}, Available: ${this.resources[type]}`);
        return false;
    }

    updateUI() {
        // Placeholder for UI update
        // In a real app, this would update DOM elements in #ui-layer
    }
}
