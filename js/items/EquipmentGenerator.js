import Equipment from '../items/Equipment.js';
import { WEAPON_DATA } from '../data/items/weapons.js';
import { ARMOR_DATA, HELM_DATA, BOOT_DATA } from '../data/items/armors.js';
import { ACCESSORY_DATA } from '../data/items/accessories.js';

/**
 * Pool of possible Substats
 */
const SUBSTAT_POOL = [
    { stat: 'crit_rate', min: 2, max: 8, label: 'Chance Crit' },
    { stat: 'crit_dmg', min: 10, max: 30, label: 'Dégâts Crit' },
    { stat: 'dodge', min: 1, max: 5, label: 'Esquive' },
    { stat: 'lifesteal', min: 1, max: 3, label: 'Vol de Vie' },
    { stat: 'heal_power', min: 5, max: 15, label: 'Soin' },
    { stat: 'res_fire', min: 5, max: 15, label: 'Res Feu' },
    { stat: 'res_water', min: 5, max: 15, label: 'Res Eau' },
    { stat: 'res_earth', min: 5, max: 15, label: 'Res Terre' },
    { stat: 'res_thunder', min: 5, max: 15, label: 'Res Foudre' },
    { stat: 'res_dark', min: 5, max: 15, label: 'Res Ténèbres' },
    // Also basic stats can appeal as substats
    { stat: 'hp', min: 20, max: 100, label: 'PV' },
    { stat: 'atk', min: 2, max: 10, label: 'ATK' },
    { stat: 'def', min: 2, max: 10, label: 'DEF' },
    { stat: 'speed', min: 1, max: 5, label: 'VIT' }
];

export default class EquipmentGenerator {

    /**
     * Generates a random equipment item with Tier control and expanded Archetypes
     * @param {string|null} slot - Optional slot filter (weapon, armor, etc.)
     * @param {number} rarity - 1 to 7 (Stars)
     * @param {number|null} tier - Specific tier (1-20), if null, random based on rarity/context
     * @returns {Equipment}
     */
    static generateRandomItem(slot = null, rarity = 1, tier = null) {
        // 1. Pick Slot
        const slots = ['weapon', 'armor', 'helm', 'boots', 'accessory'];
        const targetSlot = slot || slots[Math.floor(Math.random() * slots.length)];

        // 2. Select Data Source
        let dataSource;
        let subType = null;

        switch (targetSlot) {
            case 'weapon':
                const weaponTypes = Object.keys(WEAPON_DATA); // ['sword', 'axe', ...]
                subType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
                dataSource = WEAPON_DATA[subType];
                break;
            case 'armor':
                const armorTypes = Object.keys(ARMOR_DATA); // ['plate', 'leather', 'cloth']
                subType = armorTypes[Math.floor(Math.random() * armorTypes.length)];
                dataSource = ARMOR_DATA[subType];
                break;
            case 'helm':
                const helmTypes = Object.keys(HELM_DATA);
                subType = helmTypes[Math.floor(Math.random() * helmTypes.length)];
                dataSource = HELM_DATA[subType];
                break;
            case 'boots':
                const bootTypes = Object.keys(BOOT_DATA);
                subType = bootTypes[Math.floor(Math.random() * bootTypes.length)];
                dataSource = BOOT_DATA[subType];
                break;
            case 'accessory':
                dataSource = ACCESSORY_DATA;
                break;
        }

        // 3. Pick Template from Tier
        let template;
        if (tier) {
            // Filter all items of this tier
            const tierItems = dataSource.filter(t => t.tier === tier);
            if (tierItems.length > 0) {
                // Pick one at random
                template = tierItems[Math.floor(Math.random() * tierItems.length)];
            } else {
                // Fallback if tier not found
                template = dataSource[0];
            }
        } else {
            // Fallback: Random tier from all data
            template = dataSource[Math.floor(Math.random() * dataSource.length)];
        }

        // 4. Generate Item ID
        const id = 'item_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        // 5. Roll Substats
        // Rule: 1 Substat per 2 Rarity levels
        const substatCount = Math.ceil(rarity / 2);
        const substats = {};

        for (let i = 0; i < substatCount; i++) {
            const roll = SUBSTAT_POOL[Math.floor(Math.random() * SUBSTAT_POOL.length)];
            const val = Math.floor(Math.random() * (roll.max - roll.min + 1)) + roll.min;

            // Add or accumulate
            if (substats[roll.stat]) {
                substats[roll.stat] += val;
            } else {
                substats[roll.stat] = val;
            }
        }

        // 6. Create Instance
        const item = new Equipment(
            id,
            template.name,
            `Un équipement de rang ${template.tier}. ${subType ? 'Type: ' + subType : ''}`,
            targetSlot,
            template.stats,
            rarity,
            substats
        );

        // Save Tier info in the item
        item.tier = template.tier;
        // Save SubType if needed
        item.subType = subType;

        return item;
    }

    /**
     * Get Max Tier available
     */
    static getMaxTier() {
        return 20;
    }
}
