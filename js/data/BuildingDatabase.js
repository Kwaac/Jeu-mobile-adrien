// Base de données des bâtiments du village

export const BUILDING_DATABASE = {
    'town_hall': {
        id: 'town_hall',
        name: 'Hôtel de Ville',
        description: 'Cœur du village. Débloque les niveaux maximum des autres bâtiments.',
        icon: '🏛️',
        maxLevel: 10,
        baseCost: { gold: 1000, crystals: 0, essences: 0 },
        costMultiplier: 1.5,
        buildTime: 0, // Instantané pour le premier niveau
        upgradeTimeBase: 300, // 5 minutes au niveau 1
        upgradeTimeMultiplier: 1.3,
        benefits: {
            type: 'unlock',
            description: 'Débloque les niveaux des autres bâtiments'
        }
    },
    'crystal_mine': {
        id: 'crystal_mine',
        name: 'Mine de Cristaux',
        description: 'Génère des Cristaux utilisés pour le craft et le raffinage.',
        icon: '💎',
        maxLevel: 10,
        baseCost: { gold: 500, crystals: 0, essences: 0 },
        costMultiplier: 1.4,
        buildTime: 60, // 1 minute
        upgradeTimeBase: 180, // 3 minutes
        upgradeTimeMultiplier: 1.3,
        benefits: {
            type: 'production',
            resource: 'crystals',
            baseProduction: 5, // par heure
            productionMultiplier: 1.5,
            baseCapacity: 100,
            capacityMultiplier: 1.5
        }
    },
    'alchemy_lab': {
        id: 'alchemy_lab',
        name: 'Atelier d\'Alchimie',
        description: 'Produit des Essences pour créer des potions et matériaux spéciaux.',
        icon: '⚗️',
        maxLevel: 10,
        baseCost: { gold: 500, crystals: 0, essences: 0 },
        costMultiplier: 1.4,
        buildTime: 60, // 1 minute
        upgradeTimeBase: 180, // 3 minutes
        upgradeTimeMultiplier: 1.3,
        benefits: {
            type: 'production',
            resource: 'essences',
            baseProduction: 3, // par heure
            productionMultiplier: 1.5,
            baseCapacity: 60,
            capacityMultiplier: 1.5
        }
    },
    'market': {
        id: 'market',
        name: 'Marché',
        description: 'Génère de l\'or passivement.',
        icon: '🏪',
        maxLevel: 10,
        baseCost: { gold: 800, crystals: 5, essences: 0 },
        costMultiplier: 1.4,
        buildTime: 120, // 2 minutes
        upgradeTimeBase: 240, // 4 minutes
        upgradeTimeMultiplier: 1.3,
        benefits: {
            type: 'production',
            resource: 'gold',
            baseProduction: 100, // par heure
            productionMultiplier: 1.6,
            baseCapacity: 5000,
            capacityMultiplier: 1.5
        }
    },
    'forge': {
        id: 'forge',
        name: 'Forge Mystique',
        description: 'Permet le craft et le raffinage d\'équipements. Niveau requis pour raffiner.',
        icon: '⚒️',
        maxLevel: 10,
        baseCost: { gold: 1200, crystals: 10, essences: 5 },
        costMultiplier: 1.5,
        buildTime: 180, // 3 minutes
        upgradeTimeBase: 360, // 6 minutes
        upgradeTimeMultiplier: 1.4,
        benefits: {
            type: 'unlock',
            description: 'Débloque le raffinage d\'objets à des niveaux supérieurs'
        }
    },
    'blacksmith': {
        id: 'blacksmith',
        name: 'Forgeron',
        description: 'Amélioration et raffinage d\'équipements. Accès direct depuis le village.',
        icon: '🔨',
        maxLevel: 1,
        baseCost: { gold: 0, crystals: 0, essences: 0 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        benefits: {
            type: 'access',
            description: 'Accès à l\'amélioration et au raffinage d\'équipements'
        }
    },
    'sanctuary': {
        id: 'sanctuary',
        name: 'Sanctuaire',
        description: 'Invocation et évolution de héros. Accès direct depuis le village.',
        icon: '🏛️',
        maxLevel: 1,
        baseCost: { gold: 0, crystals: 0, essences: 0 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        benefits: {
            type: 'access',
            description: 'Accès à l\'invocation et à l\'évolution de héros'
        }
    },
    'warehouse': {
        id: 'warehouse',
        name: 'Entrepôt',
        description: 'Augmente la capacité de l\'inventaire.',
        icon: '📦',
        maxLevel: 10,
        baseCost: { gold: 600, crystals: 5, essences: 0 },
        costMultiplier: 1.3,
        buildTime: 90, // 1.5 minutes
        upgradeTimeBase: 180, // 3 minutes
        upgradeTimeMultiplier: 1.2,
        benefits: {
            type: 'capacity',
            description: 'Augmente la capacité de l\'inventaire',
            baseIncrease: 10,
            increasePerLevel: 10
        }
    }
};

/**
 * Calcule le coût d'amélioration d'un bâtiment à un niveau donné
 * @param {string} buildingId - ID du bâtiment
 * @param {number} currentLevel - Niveau actuel
 * @returns {Object} Coût en ressources
 */
export function getUpgradeCost(buildingId, currentLevel) {
    const building = BUILDING_DATABASE[buildingId];
    if (!building) return null;

    const multiplier = Math.pow(building.costMultiplier, currentLevel);

    return {
        gold: Math.floor(building.baseCost.gold * multiplier),
        crystals: Math.floor(building.baseCost.crystals * multiplier),
        essences: Math.floor(building.baseCost.essences * multiplier)
    };
}

/**
 * Calcule le temps d'amélioration en secondes
 * @param {string} buildingId - ID du bâtiment
 * @param {number} currentLevel - Niveau actuel
 * @returns {number} Temps en secondes
 */
export function getUpgradeTime(buildingId, currentLevel) {
    const building = BUILDING_DATABASE[buildingId];
    if (!building) return 0;

    if (currentLevel === 0) {
        return building.buildTime;
    }

    return Math.floor(building.upgradeTimeBase * Math.pow(building.upgradeTimeMultiplier, currentLevel - 1));
}

/**
 * Calcule la production par heure d'un bâtiment à un niveau donné
 * @param {string} buildingId - ID du bâtiment
 * @param {number} level - Niveau du bâtiment
 * @returns {number} Production par heure
 */
export function getProduction(buildingId, level) {
    const building = BUILDING_DATABASE[buildingId];
    if (!building || building.benefits.type !== 'production') return 0;

    const benefits = building.benefits;
    return Math.floor(benefits.baseProduction * Math.pow(benefits.productionMultiplier, level - 1));
}

/**
 * Calcule la capacité de stockage d'un bâtiment à un niveau donné
 * @param {string} buildingId - ID du bâtiment
 * @param {number} level - Niveau du bâtiment
 * @returns {number} Capacité de stockage
 */
export function getCapacity(buildingId, level) {
    const building = BUILDING_DATABASE[buildingId];
    if (!building || building.benefits.type !== 'production') return 0;

    const benefits = building.benefits;
    return Math.floor(benefits.baseCapacity * Math.pow(benefits.capacityMultiplier, level - 1));
}

/**
 * Retourne le niveau maximum autorisé pour un bâtiment selon le niveau de l'Hôtel de Ville
 * @param {number} townHallLevel - Niveau de l'Hôtel de Ville
 * @returns {number} Niveau maximum autorisé
 */
export function getMaxAllowedLevel(townHallLevel) {
    return townHallLevel;
}

/**
 * Retourne tous les IDs de bâtiments
 * @returns {Array<string>}
 */
export function getAllBuildingIds() {
    return Object.keys(BUILDING_DATABASE);
}
