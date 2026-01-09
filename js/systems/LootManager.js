import Item from '../items/Item.js';
import Equipment from '../items/Equipment.js';
import EquipmentGenerator from '../items/EquipmentGenerator.js';

export default class LootManager {
    constructor(game) {
        this.game = game;
        this.pendingLoot = [];
    }

    checkDrop(enemy) {
        const roll = Math.random();

        // 50% chance for drop
        if (roll < 0.5) {
            const itemRoll = Math.random();
            let item;

            // Determine Rarity and Tier based on Enemy Level
            // Enemy Level 1-5 -> Tier 1-2
            // Enemy Level 100 -> Tier 20
            const enemyLevel = enemy.level || 1;

            // Tier calculation: Level 1 -> Tier 1. Level 100 -> Tier 20.
            // Formula: Math.ceil(Level / 5) capped at 20.
            let targetTier = Math.ceil(enemyLevel / 5);
            if (targetTier < 1) targetTier = 1;
            if (targetTier > 20) targetTier = 20;

            // Rarity Calculation (Stars)
            let rarity = 1;
            const rarityRoll = Math.random();
            if (rarityRoll < 0.1) rarity = 3; // 10% chance for 3*
            else if (rarityRoll < 0.3) rarity = 2; // 20% chance for 2*

            // Harder enemies give better stars chance
            if (enemyLevel >= 30) rarity += 1;
            if (enemyLevel >= 60) rarity += 1;
            if (rarity > 7) rarity = 7;

            // 20% Equipment Drop Chance
            if (itemRoll < 0.2) {
                item = EquipmentGenerator.generateRandomItem(null, rarity, targetTier);

            } else if (itemRoll < 0.5) { // 30% Consumable
                item = new Item('potion', 'Potion', 'Heals 50 HP', 'consumable');
            } else if (itemRoll < 0.75) { // 25% Resource (Crystals)
                // Crystals directly managed usually, but dropping an item representation
                item = new Item('crystal_pack', 'Cristaux', 'Ressource d\'amélioration', 'material', { value: 10 * enemyLevel });
            } else { // 25% Resource (Essences/Fragments)
                item = new Item('essence_fire', 'Essence de Feu', 'Matériau d\'évolution', 'material', { value: 5 });
            }

            if (item) {
                this.pendingLoot.push(item);
                console.log(`Dropped: ${item.name} (Tier ${targetTier}, ${rarity}★)`);
                return item;
            }
        }
        return null; // No drop
    }

    collectLoot() {
        this.pendingLoot.forEach(item => {
            if (item.type === 'material') {
                if (item.id === 'crystal_pack') {
                    this.game.economySystem.earnResource('crystals', item.stats.value || 10);
                } else if (item.id.startsWith('essence')) {
                    this.game.economySystem.earnResource('essences', item.stats.value || 5);
                }
            } else {
                this.game.economySystem.addItem(item);
            }
        });

        const collected = [...this.pendingLoot];
        this.pendingLoot = [];
        return collected;
    }

    clearLoot() {
        this.pendingLoot = [];
    }
}
