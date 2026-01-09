// Base de données des bâtiments du village

export const BUILDING_DATABASE = {
    'town_hall': {
        id: 'town_hall',
        name: 'Hôtel de Ville',
        description: 'Cœur du village. Débloque les niveaux maximum des autres bâtiments.',
        icon: '🏛️',
        maxLevel: 10,
        layout: { x: 50, y: 35, scale: 1.3, zIndex: 10 },
        baseCost: { gold: 1000, crystals: 0, essences: 0 },
        costMultiplier: 1.5,
        buildTime: 0, // Instantané pour le premier niveau
        upgradeTimeBase: 300, // 5 minutes au niveau 1
        upgradeTimeMultiplier: 1.3,
        benefits: {
            type: 'unlock',
            description: 'Débloque les niveaux des autres bâtiments'
        },
        action: { type: 'open_modal', target: 'town_hall_info' }
    },
    'crystal_mine': {
        id: 'crystal_mine',
        name: 'Mine de Cristaux',
        description: 'Génère des Cristaux utilisés pour le craft et le raffinage.',
        icon: '💎',
        maxLevel: 10,
        layout: { x: 15, y: 55, scale: 1.0, zIndex: 5 },
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
        },
        action: { type: 'collect', resource: 'crystals' }
    },
    'alchemy_lab': {
        id: 'alchemy_lab',
        name: 'Atelier d\'Alchimie',
        description: 'Produit des Essences pour créer des potions et matériaux spéciaux.',
        icon: '⚗️',
        maxLevel: 10,
        layout: { x: 80, y: 55, scale: 1.0, zIndex: 5 },
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
        },
        action: { type: 'collect', resource: 'essences' }
    },
    'market': {
        id: 'market',
        name: 'Marché',
        description: 'Génère de l\'or passivement et permet l\'achat d\'objets.',
        icon: '🏪',
        maxLevel: 10,
        layout: { x: 30, y: 65, scale: 1.1, zIndex: 6 },
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
        },
        action: { type: 'open_screen', target: 'SHOP' }
    },
    'forgeron': {
        id: 'forgeron',
        name: 'Forgeron',
        description: 'Amélioration et raffinage d\'équipements.',
        icon: '⚒️',
        maxLevel: 1,
        layout: { x: 75, y: 45, scale: 1.1, zIndex: 6 },
        baseCost: { gold: 0, crystals: 0, essences: 0 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        benefits: {
            type: 'access',
            description: 'Accès à l\'amélioration et au raffinage d\'équipements'
        },
        action: { type: 'open_screen', target: 'GUILD', tab: 'blacksmith' }
    },
    'sanctuary': {
        id: 'sanctuary',
        name: 'Sanctuaire',
        description: 'Invocation et évolution de héros.',
        icon: '🏛️',
        maxLevel: 1,
        layout: { x: 25, y: 40, scale: 1.1, zIndex: 4 },
        baseCost: { gold: 0, crystals: 0, essences: 0 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        benefits: {
            type: 'access',
            description: 'Accès à l\'invocation et à l\'évolution de héros'
        },
        action: { type: 'open_screen', target: 'TEAM' } // Using TEAM for Sanctuary/Evolution access
    },
    'warehouse': {
        id: 'warehouse',
        name: 'Entrepôt',
        description: 'Augmente la capacité de l\'inventaire.',
        icon: '📦',
        maxLevel: 10,
        layout: { x: 80, y: 75, scale: 1.0, zIndex: 7 },
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
        },
        action: { type: 'open_screen', target: 'INVENTORY' }
    },
    'market_shop': {
        id: 'market_shop',
        name: 'Échope (Obsolète)',
        description: 'Fusionné avec le Marché.',
        icon: '🏪',
        maxLevel: 1,
        layout: { x: -100, y: -100, scale: 0, zIndex: 0 }, // Hidden
        baseCost: { gold: 0, crystals: 0, essences: 0 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        benefits: { type: 'access', description: 'Accès à la boutique' }
    },
    // NOUVEAUX BÂTIMENTS (Interactions futures)
    'arena': {
        id: 'arena',
        name: 'Arène',
        description: 'Combats PVP (Bientôt disponible).',
        icon: '⚔️',
        maxLevel: 1,
        layout: { x: 20, y: 75, scale: 1.2, zIndex: 7 },
        baseCost: { gold: 2000, crystals: 50, essences: 0 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        benefits: { type: 'access', description: 'Accès aux combats PVP' },
        action: { type: 'open_modal', target: 'coming_soon', title: 'Arène' },
    },
    'guild': {
        id: 'guild',
        name: 'Guilde',
        description: 'Communauté et missions (Bientôt disponible).',
        icon: '🛡️',
        maxLevel: 1,
        layout: { x: 65, y: 80, scale: 1.2, zIndex: 8 },
        baseCost: { gold: 1500, crystals: 20, essences: 0 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        benefits: { type: 'access', description: 'Accès aux fonctionnalités de guilde' },
        action: { type: 'open_modal', target: 'coming_soon', title: 'Guilde' },
    },
    'portal': {
        id: 'portal',
        name: 'Portail',
        description: 'Accès aux régions lointaines et donjons (Bientôt disponible).',
        icon: '🌀',
        maxLevel: 1,
        layout: { x: 50, y: 85, scale: 1.3, zIndex: 9 },
        baseCost: { gold: 3000, crystals: 100, essences: 50 },
        costMultiplier: 1.0,
        buildTime: 0,
        upgradeTimeBase: 0,
        upgradeTimeMultiplier: 1.0,
        action: { type: 'open_modal', target: 'coming_soon', title: 'Portail' }
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
