// Base de données des personnages disponibles dans le jeu

export const UNIT_DATABASE = {
    'fire_knight': {
        id: 'fire_knight',
        name: 'Chevalier de Feu',
        element: 'fire',
        class: 'Warrior', // Adding explicit class for clarity logic
        baseRarity: 3,
        maxRarity: 6,
        baseStats: {
            hp: 120,
            atk: 18,
            def: 10,
            speed: 100,
            maxBbGauge: 100
        },
        skills: [
            { name: "Frappe Enflammée", type: "damage", power: 1.2, cooldown: 0, cost: 0, description: "Attaque physique de feu." },
            { name: "Bouclier de Fer", type: "buff", stat: "def", value: 0.3, duration: 3, cooldown: 3, cost: 0, description: "+30% DEF pour 3 tours." },
            { name: "Brise-Garde", type: "damage", power: 1.5, effect: "stun", chance: 0.3, cooldown: 4, cost: 0, description: "Gros dégâts avec chance d'étourdir." }
        ],
        description: 'Un vaillant chevalier enveloppé de flammes ardentes'
    },
    'water_mage': {
        id: 'water_mage',
        name: 'Mage Aquatique',
        element: 'water',
        class: 'Support',
        baseRarity: 3,
        maxRarity: 6,
        baseStats: {
            hp: 100,
            atk: 22,
            def: 8,
            speed: 105,
            maxBbGauge: 100
        },
        skills: [
            { name: "Jet d'Eau", type: "damage", power: 1.0, cooldown: 0, description: "Attaque magique d'eau." },
            { name: "Soin Rapide", type: "heal", power: 0.4, cooldown: 3, target: "single", description: "Soigne un allié." },
            { name: "Voile Aqueux", type: "buff", stat: "def", value: 0.2, duration: 3, cooldown: 4, target: "all", description: "+20% DEF à toute l'équipe." }
        ],
        description: 'Maître des arts mystiques de l\'eau'
    },
    'earth_warrior': {
        id: 'earth_warrior',
        name: 'Guerrier Terrestre',
        element: 'earth',
        class: 'Tank',
        baseRarity: 4,
        maxRarity: 6,
        baseStats: {
            hp: 150,
            atk: 20,
            def: 15,
            speed: 90,
            maxBbGauge: 100
        },
        skills: [
            { name: "Lancé de Rocher", type: "damage", power: 1.1, cooldown: 0, description: "Attaque physique de terre." },
            { name: "Fortification", type: "buff", stat: "def", value: 0.5, duration: 3, cooldown: 5, target: "self", description: "+50% DEF (Self)." },
            { name: "Séisme", type: "damage", power: 0.8, target: "all_enemies", cooldown: 4, description: "Dégâts de zone." }
        ],
        description: 'Protecteur de la nature et gardien de la terre'
    },
    'thunder_assassin': {
        id: 'thunder_assassin',
        name: 'Assassin Foudroyant',
        element: 'thunder',
        class: 'Assassin',
        baseRarity: 4,
        maxRarity: 7,
        baseStats: {
            hp: 110,
            atk: 25,
            def: 7,
            speed: 120,
            maxBbGauge: 100
        },
        skills: [
            { name: "Éclair", type: "damage", power: 1.3, cooldown: 0, description: "Attaque rapide." },
            { name: "Vitesse Pure", type: "buff", stat: "speed", value: 0.3, duration: 3, cooldown: 4, target: "self", description: "+30% Vitesse." },
            { name: "Assassinat", type: "damage", power: 2.2, cooldown: 5, description: "Dégâts massifs sur cible unique." }
        ],
        description: 'Frappe avec la vitesse de l\'éclair'
    },
    'light_paladin': {
        id: 'light_paladin',
        name: 'Paladin Lumineux',
        element: 'light',
        class: 'Tank',
        baseRarity: 5,
        maxRarity: 7,
        baseStats: {
            hp: 160,
            atk: 23,
            def: 18,
            speed: 95,
            maxBbGauge: 100
        },
        skills: [
            { name: "Châtiment", type: "damage", power: 1.2, cooldown: 0, description: "Attaque sacrée." },
            { name: "Lumière Guérisseuse", type: "heal", power: 0.3, cooldown: 4, target: "all", description: "Soin de zone." },
            { name: "Protection Divine", type: "buff", stat: "def", value: 0.4, duration: 2, cooldown: 5, target: "all", description: "+40% DEF à l'équipe." }
        ],
        description: 'Champion de la lumière et de la justice'
    },
    'dark_necromancer': {
        id: 'dark_necromancer',
        name: 'Nécromancien Obscur',
        element: 'dark',
        class: 'Mage',
        baseRarity: 5,
        maxRarity: 7,
        baseStats: {
            hp: 130,
            atk: 28,
            def: 12,
            speed: 100,
            maxBbGauge: 100
        },
        skills: [
            { name: "Trait d'Ombre", type: "damage", power: 1.3, cooldown: 0, description: "Attaque ténébreuse." },
            { name: "Vol de Vie", type: "damage", power: 1.0, effect: "lifesteal", value: 0.5, cooldown: 3, description: "Dégâts + Soin de 50%." },
            { name: "Malédiction", type: "debuff", stat: "atk", value: 0.3, duration: 3, cooldown: 4, target: "all_enemies", description: "-30% ATK aux ennemis." }
        ],
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
        speed: Math.floor((baseStats.speed || 100) * multiplier), // Scale speed too? Maybe slower scaling.
        maxBbGauge: baseStats.maxBbGauge,
        skills: unitData.skills, // Inherit skills from database
        class: unitData.class || 'Warrior', // Inherit class
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
