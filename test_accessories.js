import EquipmentGenerator from './js/items/EquipmentGenerator.js';
import { ACCESSORY_DATA } from './js/data/items/accessories.js';

console.log("=== TEST GENERATION ACCESSOIRES ===");

// Check data size
console.log(`Nombre total d'accessoires (DATA): ${ACCESSORY_DATA.length} (Attendu: 60)`);

// Test generation for specific tiers to see if we get new items
const testTiers = [1, 5, 10, 20];

testTiers.forEach(tier => {
    console.log(`\n--- Test Generation Tier ${tier} (10 essais) ---`);
    const results = new Set();
    for (let i = 0; i < 10; i++) {
        const item = EquipmentGenerator.generateRandomItem('accessory', 1, tier);
        results.add(item.name);
    }
    console.log(`Objets générés pour Tier ${tier}:`, Array.from(results));
});
