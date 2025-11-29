// Base de données des personnages disponibles dans le jeu

export const UNIT_DATABASE = {
    'fire_knight': {
        id: 'fire_knight',
        name: 'Chevalier de Feu',
        element: 'fire',
        baseRarity: 3,
        maxRarity: 6,
        baseStats: {
            hp: 120,
            atk: 18,
            def: 10,
            maxBbGauge: 100
        },
        description: 'Un vaillant chevalier enveloppé de flammes ardentes'
    },
    'water_mage': {
        id: 'water_mage',
        name: 'Mage Aquatique',
        element: 'water',
        baseRarity: 3,
        maxRarity: 6,
        baseStats: {
            hp: 100,
            atk: 22,
            def: 8,
            maxBbGauge: 100
        },
        description: 'Maître des arts mystiques de l\'eau'
    },
    'earth_warrior': {
        id: 'earth_warrior',
        name: 'Guerrier Terrestre',
        element: 'earth',
        baseRarity: 4,
        maxRarity: 6,
        baseStats: {
            hp: 150,
            atk: 20,
            def: 15,
            maxBbGauge: 100
        },
        description: 'Protecteur de la nature et gardien de la terre'
    },
    'thunder_assassin': {
        id: 'thunder_assassin',
        name: 'Assassin Foudroyant',
        element: 'thunder',
        baseRarity: 4,
        maxRarity: 7,
        baseStats: {
            hp: 110,
            atk: 25,
            def: 7,
            maxBbGauge: 100
        },
        description: 'Frappe avec la vitesse de l\'éclair'
    },
    'light_paladin': {
        id: 'light_paladin',
        name: 'Paladin Lumineux',
        element: 'light',
        baseRarity: 5,
        maxRarity: 7,
        baseStats: {
            hp: 160,
            atk: 23,
            def: 18,
            maxBbGauge: 100
        },
        description: 'Champion de la lumière et de la justice'
    },
    'dark_necromancer': {
        id: 'dark_necromancer',
        name: 'Nécromancien Obscur',
        element: 'dark',
        baseRarity: 5,
        maxRarity: 7,
        baseStats: {
            hp: 130,
            atk: 28,
            def: 12,
            maxBbGauge: 100
        },
        description: 'Maître des ténèbres et des âmes perdues'
    }
};

// Multiplicateurs de stats par rareté
export const RARITY_MULTIPLIERS = {
    1: 0.5,
    2: 0.7,
    3: 1.0,
    4: 1.3,
    5: 1.6,
    6: 2.0,
    7: 2.5
};

// Coût d'évolution en or par rareté
export const EVOLUTION_COSTS = {
    1: 1000,
    2: 2500,
    3: 5000,
    4: 10000,
    5: 20000,
    6: 35000,
    7: 50000
};

/**
 * Récupère les données d'un personnage
 */
export function getUnitData(unitId) {
    return UNIT_DATABASE[unitId] || null;
}

/**
 * Crée une instance de stats pour un personnage à une rareté donnée
 */
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
        maxBbGauge: baseStats.maxBbGauge,
        level: 1,
        xp: 0
    };
}

/**
 * Retourne tous les IDs de personnages
 */
export function getAllUnitIds() {
    return Object.keys(UNIT_DATABASE);
}

/**
 * Retourne un personnage aléatoire selon les taux de rareté
 */
export function getRandomUnit() {
    const roll = Math.random() * 100;

    let targetRarity;
    if (roll < 5) {
        targetRarity = 5; // 5% de chance pour 5★
    } else if (roll < 20) {
        targetRarity = 4; // 15% de chance pour 4★
    } else {
        targetRarity = 3; // 80% de chance pour 3★
    }

    // Filtrer les personnages qui peuvent commencer à cette rareté
    const availableUnits = Object.values(UNIT_DATABASE).filter(
        unit => unit.baseRarity === targetRarity
    );

    if (availableUnits.length === 0) {
        // Fallback sur n'importe quel personnage
        const allIds = getAllUnitIds();
        const randomId = allIds[Math.floor(Math.random() * allIds.length)];
        const unitData = getUnitData(randomId);
        return getStatsForRarity(randomId, unitData.baseRarity);
    }

    const randomUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    return getStatsForRarity(randomUnit.id, randomUnit.baseRarity);
}
