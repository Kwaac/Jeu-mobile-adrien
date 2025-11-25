import Item from '../items/Item.js';
import Equipment from '../items/Equipment.js';

export default class LootManager {
    constructor(game) {
        this.game = game;
        this.pendingLoot = [];
    }

    checkDrop(enemy) {
        // Simple drop logic for now
        const roll = Math.random();

        if (roll < 0.3) { // 30% chance for item
            const itemRoll = Math.random();
            let item;

            if (itemRoll < 0.5) {
                item = new Item('potion', 'Potion', 'Heals 50 HP', 'consumable');
            } else {
                item = new Equipment('sword_drop', 'Iron Sword', 'Standard sword', 'weapon', { atk: 8 });
            }

            this.pendingLoot.push(item);
            console.log(`Dropped: ${item.name}`);
            return item;
        }
        return null;
    }

    collectLoot() {
        this.pendingLoot.forEach(item => {
            this.game.economySystem.addItem(item);
        });
        const collected = [...this.pendingLoot];
        this.pendingLoot = [];
        return collected;
    }

    clearLoot() {
        this.pendingLoot = [];
    }
}
