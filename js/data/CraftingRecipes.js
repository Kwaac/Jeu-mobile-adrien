// Base de données des recettes de craft et raffinage

/**
 * Table de correspondance entre niveau de Forge et étoiles d'objets
 */
export const FORGE_REQUIREMENTS = {
    1: 1, // Forge niveau 1 = objets 1★
    2: 2, // Forge niveau 2 = objets 2★
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7
};

/**
 * Coût de raffinage d'un objet vers le niveau d'étoiles suivant
 */
export const REFINE_COSTS = {
    1: { // 1★ → 2★
        crystals: 50,
        essences: 10,
        gold: 1000,
        fragments: 0
    },
    2: { // 2★ → 3★
        crystals: 100,
        essences: 25,
        gold: 2500,
        fragments: 5
    },
    3: { // 3★ → 4★
        crystals: 200,
        essences: 50,
        gold: 5000,
        fragments: 10
    },
    4: { // 4★ → 5★
        crystals: 400,
        essences: 100,
        gold: 10000,
        fragments: 20
    },
    5: { // 5★ → 6★
        crystals: 800,
        essences: 200,
        gold: 20000,
        fragments: 40
    },
    6: { // 6★ → 7★
        crystals: 1600,
        essences: 400,
        gold: 40000,
        fragments: 80
    }
};

/**
 * Temps de raffinage en secondes
 */
export const REFINE_TIMES = {
    1: 60,    // 1 minute
    2: 180,   // 3 minutes
    3: 300,   // 5 minutes
    4: 600,   // 10 minutes
    5: 1200,  // 20 minutes
    6: 1800   // 30 minutes
};

/**
 * Multiplicateur de stats par niveau d'étoiles
 */
export const STAR_STAT_MULTIPLIER = 1.2; // +20% par étoile

/**
 * Vérifie si un objet peut être raffiné
 * @param {Object} item - L'objet à raffiner
 * @param {number} forgeLevel - Niveau de la Forge
 * @returns {boolean}
 */
export function canRefineItem(item, forgeLevel) {
    if (!item || !item.stars) return false;
    if (item.stars >= 7) return false; // Maximum 7 étoiles

    const requiredForgeLevel = FORGE_REQUIREMENTS[item.stars + 1];
    return forgeLevel >= requiredForgeLevel;
}

/**
 * Retourne le coût de raffinage pour un objet
 * @param {Object} item - L'objet à raffiner
 * @returns {Object|null} Coût en ressources
 */
export function getRefineCost(item) {
    if (!item || !item.stars || item.stars >= 7) return null;
    return REFINE_COSTS[item.stars];
}

/**
 * Retourne le temps de raffinage pour un objet
 * @param {Object} item - L'objet à raffiner
 * @returns {number} Temps en secondes
 */
export function getRefineTime(item) {
    if (!item || !item.stars || item.stars >= 7) return 0;
    return REFINE_TIMES[item.stars];
}

/**
 * Calcule les nouvelles stats d'un objet après raffinage
 * @param {Object} item - L'objet à raffiner
 * @returns {Object} Nouvelles stats
 */
export function calculateRefinedStats(item) {
    if (!item || !item.baseStats) return null;

    const newStars = item.stars + 1;
    const multiplier = Math.pow(STAR_STAT_MULTIPLIER, newStars - 1);

    const newStats = {};
    for (let stat in item.baseStats) {
        newStats[stat] = Math.floor(item.baseStats[stat] * multiplier);
    }

    return newStats;
}

/**
 * Retourne le niveau de Forge requis pour raffiner un objet
 * @param {Object} item - L'objet
 * @returns {number} Niveau de Forge requis
 */
export function getRequiredForgeLevel(item) {
    if (!item || !item.stars) return 1;
    return FORGE_REQUIREMENTS[item.stars + 1] || 10;
}
