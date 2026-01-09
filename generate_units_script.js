
const fs = require('fs');

const ELEMENTS = ['fire', 'water', 'earth', 'thunder', 'light', 'dark'];
const ROLES = {
    'Tank': { count: 3, stats: { hp: 150, atk: 15, def: 20, speed: 90 }, rarity: [3, 4, 5] },
    'Warrior': { count: 2, stats: { hp: 120, atk: 20, def: 15, speed: 100 }, rarity: [3, 4] },
    'Support': { count: 4, stats: { hp: 100, atk: 12, def: 12, speed: 105 }, rarity: [3, 3, 4, 5] },
    'Ranger': { count: 2, stats: { hp: 90, atk: 22, def: 8, speed: 110 }, rarity: [3, 4] },
    'Assassin': { count: 2, stats: { hp: 80, atk: 25, def: 6, speed: 120 }, rarity: [4, 5] },
    'Mage': { count: 2, stats: { hp: 85, atk: 24, def: 8, speed: 95 }, rarity: [3, 5] }
};

const SKILL_TEMPLATES = {
    'Tank': [
        { name: "Taunt", type: "buff", stat: "def", value: 0.3, duration: 3, target: "self", description: "Taunt enemies" },
        { name: "Shield Wall", type: "buff", stat: "def", value: 0.5, duration: 2, target: "all", description: "Team Defense Up" }
    ],
    'Warrior': [
        { name: "Strike", type: "damage", power: 1.2, description: "Strong Attack" },
        { name: "Battle Cry", type: "buff", stat: "atk", value: 0.3, duration: 3, target: "all", description: "Team Attack Up" }
    ],
    'Support': [
        { name: "Heal", type: "heal", value: 40, target: "single", description: "Heal Ally" },
        { name: "Blessing", type: "buff", stat: "def", value: 0.2, duration: 3, target: "all", description: "Minor Defense Up" }
    ],
    'Ranger': [
        { name: "Snipe", type: "damage", power: 1.5, description: "High Damage Single Target" },
        { name: "Volley", type: "damage", power: 0.8, target: "all_enemies", description: "Area Damage" }
    ],
    'Assassin': [
        { name: "Backstab", type: "damage", power: 2.0, description: "Massive Damage" },
        { name: "Poison", type: "damage", power: 1.0, description: "Damage over time" }
    ],
    'Mage': [
        { name: "Fireball", type: "damage", power: 1.3, description: "Magic Attack" },
        { name: "Meteor", type: "damage", power: 1.5, target: "all_enemies", description: "Massive Area Damage" }
    ]
};

const UNIT_DATABASE = {};

function generateName(element, role, index) {
    const prefixes = {
        'fire': ['Blaze', 'Ignis', 'Pyre', 'Ember', 'Ash', 'Flame', 'Inferno', 'Cinder', 'Magma', 'Scorch', 'Flare', 'Heat', 'Burn', 'Coal', 'Lava'],
        'water': ['Aqua', 'Tide', 'Wave', 'Mist', 'Rain', 'Ocean', 'Frost', 'Ice', 'Stream', 'River', 'Lake', 'Drop', 'Sea', 'Coral', 'Bubble'],
        'earth': ['Terra', 'Rock', 'Stone', 'Root', 'Leaf', 'Gaia', 'Dust', 'Sand', 'Mud', 'Clay', 'Moss', 'Bark', 'Vine', 'Boulder', 'Pebble'],
        'thunder': ['Storm', 'Volt', 'Spark', 'Zap', 'Bolt', 'Shock', 'Flash', 'Thunder', 'Lightning', 'Surge', 'Current', 'Amp', 'Watt', 'Jolt', 'Static'],
        'light': ['Lux', 'Ray', 'Shine', 'Glow', 'Sun', 'Star', 'Bright', 'Dawn', 'Day', 'Beam', 'Halo', 'Glory', 'Radiance', 'Lum', 'Sparkle'],
        'dark': ['Umbra', 'Shadow', 'Night', 'Dusk', 'Void', 'Abyss', 'Gloom', 'Shade', 'Obsidian', 'Raven', 'Crow', 'Bat', 'Ghost', 'Phantom', 'Specter']
    };

    const suffixes = {
        'Tank': ['Shield', 'Guard', 'Wall', 'Keeper', 'Defender', 'Protector', 'Sentinel'],
        'Warrior': ['Blade', 'Sword', 'Fist', 'Striker', 'Fighter', 'Brawler', 'Knight'],
        'Support': ['Healer', 'Priest', 'Cleric', 'Mender', 'Aide', 'Guide', 'Oracle'],
        'Ranger': ['Bow', 'Arrow', 'Shot', 'Hunter', 'Scout', 'Sniper', 'Marksman'],
        'Assassin': ['Dagger', 'Blade', 'Shadow', 'Ninja', 'Rogue', 'Killer', 'Slayer'],
        'Mage': ['Wand', 'Staff', 'Caster', 'Wizard', 'Sorcerer', 'Witch', 'Mage']
    };

    const prefix = prefixes[element]?.[index] || element;
    const suffix = suffixes[role]?.[Math.floor(Math.random() * suffixes[role].length)] || role;

    return `${prefix} ${suffix}`;
}

ELEMENTS.forEach(element => {
    Object.keys(ROLES).forEach(role => {
        const config = ROLES[role];
        for (let i = 0; i < config.count; i++) {
            const id = `${element}_${role.toLowerCase()}_${i + 1}`;
            const name = generateName(element, role, i + (Object.keys(ROLES).indexOf(role) * 2));
            const rarity = config.rarity[Math.min(i, config.rarity.length - 1)];

            // Randomize stats slightly (+/- 5%)
            const stats = { ...config.stats };
            Object.keys(stats).forEach(k => {
                stats[k] = Math.floor(stats[k] * (0.95 + Math.random() * 0.1));
            });
            stats.maxBbGauge = 100;

            const unit = {
                id: id,
                name: name,
                element: element,
                class: role,
                baseRarity: rarity,
                maxRarity: Math.min(rarity + 3, 7),
                baseStats: stats,
                skills: [
                    { name: "Attack", type: "damage", power: 1.0, cooldown: 0, description: "Basic Attack" },
                    // Pick 1 random skill from template
                    SKILL_TEMPLATES[role][Math.floor(Math.random() * SKILL_TEMPLATES[role].length)],
                    // Pick another random (Ultimate)
                    { ...SKILL_TEMPLATES[role][Math.floor(Math.random() * SKILL_TEMPLATES[role].length)], name: "Ultimate", power: (SKILL_TEMPLATES[role][0].power || 1) * 1.5, cooldown: 5 }
                ],
                description: `A ${role} of the ${element} element.`
            };

            UNIT_DATABASE[id] = unit;
        }
    });
});

const output = `// Base de données générée automatiquement
export const UNIT_DATABASE = ${JSON.stringify(UNIT_DATABASE, null, 4)};

export const RARITY_MULTIPLIERS = {
    1: 0.5,
    2: 0.7,
    3: 1.0,
    4: 1.3,
    5: 1.6,
    6: 2.0,
    7: 2.5
};

export const EVOLUTION_COSTS = {
    1: 1000,
    2: 2500,
    3: 5000,
    4: 10000,
    5: 20000,
    6: 35000,
    7: 50000
};

export function getUnitData(unitId) {
    return UNIT_DATABASE[unitId] || null;
}

export function getStatsForRarity(unitId, rarity) {
    const unitData = getUnitData(unitId);
    if (!unitData) return null;

    const multiplier = RARITY_MULTIPLIERS[rarity] || 1.0;
    const baseStats = unitData.baseStats;

    return {
        name: unitData.name,
        element: unitData.element,
        description: unitData.description,
        unitId: unitId,
        baseRarity: unitData.baseRarity,
        currentRarity: rarity,
        maxRarity: unitData.maxRarity,
        hp: Math.floor(baseStats.hp * multiplier),
        atk: Math.floor(baseStats.atk * multiplier),
        def: Math.floor(baseStats.def * multiplier),
        speed: Math.floor((baseStats.speed || 100) * multiplier),
        maxBbGauge: baseStats.maxBbGauge,
        skills: unitData.skills,
        class: unitData.class || 'Warrior',
        level: 1,
        xp: 0
    };
}

export function getAllUnitIds() {
    return Object.keys(UNIT_DATABASE);
}

export function getRandomUnit() {
    const roll = Math.random() * 100;
    let targetRarity;
    if (roll < 5) targetRarity = 5;
    else if (roll < 20) targetRarity = 4;
    else targetRarity = 3;

    const availableUnits = Object.values(UNIT_DATABASE).filter(
        unit => unit.baseRarity === targetRarity
    );

    if (availableUnits.length === 0) {
        const allIds = getAllUnitIds();
        const randomId = allIds[Math.floor(Math.random() * allIds.length)];
        const unitData = getUnitData(randomId);
        return getStatsForRarity(randomId, unitData.baseRarity);
    }

    const randomUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    return getStatsForRarity(randomUnit.id, randomUnit.baseRarity);
}
`;

fs.writeFileSync('d:/Jeu-mobile-adrien/js/data/UnitDatabase.js', output);
console.log('UnitDatabase.js generated with ' + Object.keys(UNIT_DATABASE).length + ' units.');
