// Base de données des zones d'histoire
// Système de progression : 7 zones, 10 étapes par zone + 1 boss final

/**
 * Formule de difficulté :
 * baseStat * (1 + (zoneId - 1) * 0.3 + (stageId - 1) * 0.1)
 * Boss : stats régulières * 2.5
 */

// Définition des ennemis par zone
export const ENEMY_TEMPLATES = {
    // ===== ZONE 1: PLAINES DE MIDGARD =====
    zone1_slime: {
        name: 'Slime Vert',
        baseHp: 30,
        baseAtk: 5,
        baseDef: 1,
        baseExp: 8,
        baseZel: 15
    },
    zone1_goblin_scout: {
        name: 'Gobelin Scout',
        baseHp: 35,
        baseAtk: 7,
        baseDef: 2,
        baseExp: 10,
        baseZel: 20
    },
    zone1_wolf: {
        name: 'Loup Gris',
        baseHp: 40,
        baseAtk: 8,
        baseDef: 2,
        baseExp: 12,
        baseZel: 22
    },
    zone1_boar: {
        name: 'Sanglier Sauvage',
        baseHp: 45,
        baseAtk: 6,
        baseDef: 4,
        baseExp: 11,
        baseZel: 18
    },
    zone1_goblin_archer: {
        name: 'Gobelin Archer',
        baseHp: 32,
        baseAtk: 9,
        baseDef: 1,
        baseExp: 13,
        baseZel: 24
    },
    zone1_raven: {
        name: 'Corbeau Noir',
        baseHp: 28,
        baseAtk: 10,
        baseDef: 1,
        baseExp: 9,
        baseZel: 16
    },
    zone1_bandit: {
        name: 'Bandit Novice',
        baseHp: 38,
        baseAtk: 8,
        baseDef: 3,
        baseExp: 14,
        baseZel: 25
    },
    zone1_boss: {
        name: 'Petit Fenrir',
        baseHp: 120,
        baseAtk: 15,
        baseDef: 8,
        baseExp: 100,
        baseZel: 150,
        isBoss: true
    },

    // ===== ZONE 2: RACINES D'YGGDRASIL =====
    zone2_tree_spirit: {
        name: 'Esprit des Arbres',
        baseHp: 50,
        baseAtk: 12,
        baseDef: 6,
        baseExp: 18,
        baseZel: 30
    },
    zone2_dryad: {
        name: 'Dryade',
        baseHp: 45,
        baseAtk: 14,
        baseDef: 4,
        baseExp: 20,
        baseZel: 35
    },
    zone2_corrupted_root: {
        name: 'Racine Corrompue',
        baseHp: 60,
        baseAtk: 10,
        baseDef: 8,
        baseExp: 16,
        baseZel: 28
    },
    zone2_forest_sprite: {
        name: 'Lutin Forestier',
        baseHp: 42,
        baseAtk: 15,
        baseDef: 3,
        baseExp: 19,
        baseZel: 32
    },
    zone2_giant_mushroom: {
        name: 'Champignon Géant',
        baseHp: 55,
        baseAtk: 11,
        baseDef: 7,
        baseExp: 17,
        baseZel: 29
    },
    zone2_dark_fairy: {
        name: 'Fée Sombre',
        baseHp: 40,
        baseAtk: 16,
        baseDef: 2,
        baseExp: 21,
        baseZel: 36
    },
    zone2_treant: {
        name: 'Treant Mineur',
        baseHp: 65,
        baseAtk: 13,
        baseDef: 9,
        baseExp: 22,
        baseZel: 38
    },
    zone2_boss: {
        name: 'Rejeton de Nidhogg',
        baseHp: 180,
        baseAtk: 22,
        baseDef: 12,
        baseExp: 200,
        baseZel: 300,
        isBoss: true
    },

    // ===== ZONE 3: GIVRE DE JOTUNHEIM =====
    zone3_ice_troll: {
        name: 'Troll de Glace',
        baseHp: 70,
        baseAtk: 18,
        baseDef: 10,
        baseExp: 28,
        baseZel: 45
    },
    zone3_frost_giant: {
        name: 'Géant du Givre',
        baseHp: 85,
        baseAtk: 20,
        baseDef: 12,
        baseExp: 32,
        baseZel: 52
    },
    zone3_frozen_warrior: {
        name: 'Guerrier Gelé',
        baseHp: 65,
        baseAtk: 22,
        baseDef: 8,
        baseExp: 30,
        baseZel: 48
    },
    zone3_yeti: {
        name: 'Yéti',
        baseHp: 75,
        baseAtk: 19,
        baseDef: 11,
        baseExp: 29,
        baseZel: 46
    },
    zone3_snow_wolf: {
        name: 'Loup des Neiges',
        baseHp: 60,
        baseAtk: 24,
        baseDef: 6,
        baseExp: 27,
        baseZel: 44
    },
    zone3_ice_spirit: {
        name: 'Esprit Glacial',
        baseHp: 55,
        baseAtk: 25,
        baseDef: 5,
        baseExp: 31,
        baseZel: 50
    },
    zone3_ice_golem: {
        name: 'Golem de Glace',
        baseHp: 90,
        baseAtk: 16,
        baseDef: 15,
        baseExp: 33,
        baseZel: 54
    },
    zone3_boss: {
        name: 'Thrym le Jarl Glacial',
        baseHp: 250,
        baseAtk: 32,
        baseDef: 18,
        baseExp: 320,
        baseZel: 480,
        isBoss: true
    },

    // ===== ZONE 4: PORTES DU VALHALLA =====
    zone4_fallen_warrior: {
        name: 'Guerrier Déchu',
        baseHp: 80,
        baseAtk: 26,
        baseDef: 12,
        baseExp: 38,
        baseZel: 60
    },
    zone4_valkyrie_trainee: {
        name: 'Apprentie Valkyrie',
        baseHp: 70,
        baseAtk: 30,
        baseDef: 10,
        baseExp: 42,
        baseZel: 65
    },
    zone4_shield_maiden: {
        name: 'Vierge Bouclière',
        baseHp: 85,
        baseAtk: 24,
        baseDef: 14,
        baseExp: 40,
        baseZel: 62
    },
    zone4_berserker: {
        name: 'Berserker Fantôme',
        baseHp: 75,
        baseAtk: 32,
        baseDef: 8,
        baseExp: 44,
        baseZel: 68
    },
    zone4_einherjar_lancer: {
        name: 'Lancier Einherjar',
        baseHp: 78,
        baseAtk: 28,
        baseDef: 11,
        baseExp: 41,
        baseZel: 64
    },
    zone4_celestial_archer: {
        name: 'Archer Céleste',
        baseHp: 68,
        baseAtk: 31,
        baseDef: 9,
        baseExp: 43,
        baseZel: 66
    },
    zone4_gate_guardian: {
        name: 'Gardien du Portail',
        baseHp: 95,
        baseAtk: 25,
        baseDef: 16,
        baseExp: 45,
        baseZel: 70
    },
    zone4_boss: {
        name: 'Champion Einherjar',
        baseHp: 320,
        baseAtk: 42,
        baseDef: 22,
        baseExp: 450,
        baseZel: 650,
        isBoss: true
    },

    // ===== ZONE 5: FLAMMES DE MUSPELHEIM =====
    zone5_fire_demon: {
        name: 'Démon de Feu',
        baseHp: 90,
        baseAtk: 35,
        baseDef: 10,
        baseExp: 50,
        baseZel: 78
    },
    zone5_lava_elemental: {
        name: 'Élémentaire de Lave',
        baseHp: 85,
        baseAtk: 38,
        baseDef: 8,
        baseExp: 52,
        baseZel: 82
    },
    zone5_flame_spirit: {
        name: 'Esprit des Flammes',
        baseHp: 75,
        baseAtk: 40,
        baseDef: 6,
        baseExp: 54,
        baseZel: 85
    },
    zone5_salamander: {
        name: 'Salamandre Géante',
        baseHp: 95,
        baseAtk: 33,
        baseDef: 12,
        baseExp: 51,
        baseZel: 80
    },
    zone5_magma_golem: {
        name: 'Golem de Magma',
        baseHp: 110,
        baseAtk: 30,
        baseDef: 18,
        baseExp: 53,
        baseZel: 84
    },
    zone5_imp: {
        name: 'Diablotin Ardent',
        baseHp: 70,
        baseAtk: 42,
        baseDef: 5,
        baseExp: 55,
        baseZel: 88
    },
    zone5_phoenix: {
        name: 'Phénix Mineur',
        baseHp: 80,
        baseAtk: 36,
        baseDef: 9,
        baseExp: 56,
        baseZel: 90
    },
    zone5_boss: {
        name: 'Héraut de Surtr',
        baseHp: 400,
        baseAtk: 55,
        baseDef: 25,
        baseExp: 600,
        baseZel: 850,
        isBoss: true
    },

    // ===== ZONE 6: OMBRES DE NIFLHEIM =====
    zone6_death_knight: {
        name: 'Chevalier de la Mort',
        baseHp: 100,
        baseAtk: 40,
        baseDef: 20,
        baseExp: 62,
        baseZel: 95
    },
    zone6_shadow_wraith: {
        name: 'Spectre d\'Ombre',
        baseHp: 85,
        baseAtk: 45,
        baseDef: 12,
        baseExp: 65,
        baseZel: 100
    },
    zone6_ice_revenant: {
        name: 'Revenant de Glace',
        baseHp: 95,
        baseAtk: 42,
        baseDef: 16,
        baseExp: 63,
        baseZel: 98
    },
    zone6_lich: {
        name: 'Liche Mineure',
        baseHp: 90,
        baseAtk: 48,
        baseDef: 14,
        baseExp: 68,
        baseZel: 105
    },
    zone6_lost_soul: {
        name: 'Âme Errante',
        baseHp: 75,
        baseAtk: 50,
        baseDef: 8,
        baseExp: 64,
        baseZel: 99
    },
    zone6_draugr: {
        name: 'Draugr',
        baseHp: 105,
        baseAtk: 38,
        baseDef: 22,
        baseExp: 66,
        baseZel: 102
    },
    zone6_banshee: {
        name: 'Banshee',
        baseHp: 80,
        baseAtk: 46,
        baseDef: 10,
        baseExp: 67,
        baseZel: 104
    },
    zone6_boss: {
        name: 'Gardien de Hel',
        baseHp: 480,
        baseAtk: 65,
        baseDef: 30,
        baseExp: 780,
        baseZel: 1100,
        isBoss: true
    },

    // ===== ZONE 7: SOMMET D'ASGARD =====
    zone7_divine_construct: {
        name: 'Construction Divine',
        baseHp: 120,
        baseAtk: 50,
        baseDef: 25,
        baseExp: 75,
        baseZel: 115
    },
    zone7_aesir_guard: {
        name: 'Garde Ase',
        baseHp: 110,
        baseAtk: 55,
        baseDef: 22,
        baseExp: 78,
        baseZel: 120
    },
    zone7_celestial_warrior: {
        name: 'Guerrier Céleste',
        baseHp: 105,
        baseAtk: 58,
        baseDef: 20,
        baseExp: 80,
        baseZel: 125
    },
    zone7_fallen_angel: {
        name: 'Ange Déchu',
        baseHp: 100,
        baseAtk: 60,
        baseDef: 18,
        baseExp: 82,
        baseZel: 128
    },
    zone7_golden_sentinel: {
        name: 'Sentinelle d\'Or',
        baseHp: 130,
        baseAtk: 52,
        baseDef: 28,
        baseExp: 76,
        baseZel: 118
    },
    zone7_runic_spirit: {
        name: 'Esprit Runique',
        baseHp: 95,
        baseAtk: 62,
        baseDef: 16,
        baseExp: 84,
        baseZel: 132
    },
    zone7_minor_titan: {
        name: 'Titan Mineur',
        baseHp: 140,
        baseAtk: 48,
        baseDef: 30,
        baseExp: 85,
        baseZel: 135
    },
    zone7_boss: {
        name: 'Ase Corrompu',
        baseHp: 600,
        baseAtk: 80,
        baseDef: 38,
        baseExp: 1000,
        baseZel: 1500,
        isBoss: true
    }
};

/**
 * Calcule les stats d'un ennemi en fonction de la zone et de l'étape
 */
function calculateEnemyStats(template, zoneId, stageId) {
    const difficultyMultiplier = 1 + (zoneId - 1) * 0.3 + (stageId - 1) * 0.1;
    const bossMultiplier = template.isBoss ? 2.5 : 1.0;
    const totalMultiplier = difficultyMultiplier * bossMultiplier;

    return {
        name: template.name,
        hp: Math.floor(template.baseHp * totalMultiplier),
        atk: Math.floor(template.baseAtk * totalMultiplier),
        def: Math.floor(template.baseDef * totalMultiplier),
        exp: Math.floor(template.baseExp * totalMultiplier),
        zel: Math.floor(template.baseZel * totalMultiplier),
        isBoss: template.isBoss || false
    };
}

/**
 * Génère une composition d'ennemis pour une étape
 */
function generateStageEnemies(zoneId, stageId, enemyKeys) {
    // Mélanger les ennemis disponibles
    const shuffled = [...enemyKeys].sort(() => Math.random() - 0.5);

    // Nombre d'ennemis basé sur l'étape (1-3 ennemis)
    const enemyCount = Math.min(1 + Math.floor(stageId / 4), 3);

    // Sélectionner les ennemis
    const selectedKeys = shuffled.slice(0, enemyCount);

    return selectedKeys.map(key =>
        calculateEnemyStats(ENEMY_TEMPLATES[key], zoneId, stageId)
    );
}

// Définition des 7 zones
export const STORY_ZONES = [
    {
        id: 1,
        name: 'Plaines de Midgard',
        description: 'Terres de départ où les aventuriers font leurs premiers pas.',
        theme: 'Créatures sauvages et bandits',
        energyCost: 5,
        enemyPool: [
            'zone1_slime',
            'zone1_goblin_scout',
            'zone1_wolf',
            'zone1_boar',
            'zone1_goblin_archer',
            'zone1_raven',
            'zone1_bandit'
        ],
        bossKey: 'zone1_boss',
        unlocked: true // Zone 1 débloquée par défaut
    },
    {
        id: 2,
        name: 'Racines d\'Yggdrasil',
        description: 'Les racines anciennes de l\'arbre-monde, habitées par des esprits.',
        theme: 'Esprits de la nature',
        energyCost: 7,
        enemyPool: [
            'zone2_tree_spirit',
            'zone2_dryad',
            'zone2_corrupted_root',
            'zone2_forest_sprite',
            'zone2_giant_mushroom',
            'zone2_dark_fairy',
            'zone2_treant'
        ],
        bossKey: 'zone2_boss',
        unlocked: false
    },
    {
        id: 3,
        name: 'Givre de Jotunheim',
        description: 'Royaume gelé des géants, où le froid éternel règne.',
        theme: 'Géants et créatures de glace',
        energyCost: 9,
        enemyPool: [
            'zone3_ice_troll',
            'zone3_frost_giant',
            'zone3_frozen_warrior',
            'zone3_yeti',
            'zone3_snow_wolf',
            'zone3_ice_spirit',
            'zone3_ice_golem'
        ],
        bossKey: 'zone3_boss',
        unlocked: false
    },
    {
        id: 4,
        name: 'Portes du Valhalla',
        description: 'Épreuves des guerriers tombés au combat, gardées par les Valkyries.',
        theme: 'Guerriers einherjar',
        energyCost: 11,
        enemyPool: [
            'zone4_fallen_warrior',
            'zone4_valkyrie_trainee',
            'zone4_shield_maiden',
            'zone4_berserker',
            'zone4_einherjar_lancer',
            'zone4_celestial_archer',
            'zone4_gate_guardian'
        ],
        bossKey: 'zone4_boss',
        unlocked: false
    },
    {
        id: 5,
        name: 'Flammes de Muspelheim',
        description: 'Royaume ardent du feu primordial, domaine des démons de lave.',
        theme: 'Démons et élémentaires de feu',
        energyCost: 13,
        enemyPool: [
            'zone5_fire_demon',
            'zone5_lava_elemental',
            'zone5_flame_spirit',
            'zone5_salamander',
            'zone5_magma_golem',
            'zone5_imp',
            'zone5_phoenix'
        ],
        bossKey: 'zone5_boss',
        unlocked: false
    },
    {
        id: 6,
        name: 'Ombres de Niflheim',
        description: 'Royaume des morts et des ombres, où règne Hel.',
        theme: 'Morts-vivants et esprits',
        energyCost: 15,
        enemyPool: [
            'zone6_death_knight',
            'zone6_shadow_wraith',
            'zone6_ice_revenant',
            'zone6_lich',
            'zone6_lost_soul',
            'zone6_draugr',
            'zone6_banshee'
        ],
        bossKey: 'zone6_boss',
        unlocked: false
    },
    {
        id: 7,
        name: 'Sommet d\'Asgard',
        description: 'Le royaume des dieux Ases, défi ultime des plus grands héros.',
        theme: 'Constructions divines et gardiens célestes',
        energyCost: 18,
        enemyPool: [
            'zone7_divine_construct',
            'zone7_aesir_guard',
            'zone7_celestial_warrior',
            'zone7_fallen_angel',
            'zone7_golden_sentinel',
            'zone7_runic_spirit',
            'zone7_minor_titan'
        ],
        bossKey: 'zone7_boss',
        unlocked: false
    }
];

/**
 * Génère les 10 étapes + boss pour une zone
 */
export function generateZoneStages(zoneId) {
    const zone = STORY_ZONES.find(z => z.id === zoneId);
    if (!zone) return null;

    const stages = [];

    // Générer les 10 étapes normales
    for (let stageId = 1; stageId <= 10; stageId++) {
        stages.push({
            zoneId,
            stageId,
            name: `Étape ${stageId}`,
            energyCost: zone.energyCost,
            waves: [
                generateStageEnemies(zoneId, stageId, zone.enemyPool)
            ],
            rewards: {
                exp: Math.floor(50 * (1 + (zoneId - 1) * 0.5 + (stageId - 1) * 0.1)),
                zel: Math.floor(100 * (1 + (zoneId - 1) * 0.5 + (stageId - 1) * 0.1))
            },
            isBoss: false,
            unlocked: stageId === 1 // Première étape débloquée par défaut
        });
    }

    // Ajouter le boss (étape 11)
    const bossStats = calculateEnemyStats(ENEMY_TEMPLATES[zone.bossKey], zoneId, 11);
    stages.push({
        zoneId,
        stageId: 11,
        name: `Boss: ${bossStats.name}`,
        energyCost: zone.energyCost * 2, // Boss coûte 2x l'énergie
        waves: [[bossStats]],
        rewards: {
            exp: Math.floor(500 * (1 + (zoneId - 1) * 0.8)),
            zel: Math.floor(800 * (1 + (zoneId - 1) * 0.8))
        },
        isBoss: true,
        unlocked: false
    });

    return stages;
}

/**
 * Récupère les informations d'une zone
 */
export function getZoneData(zoneId) {
    return STORY_ZONES.find(z => z.id === zoneId) || null;
}

/**
 * Récupère toutes les zones
 */
export function getAllZones() {
    return STORY_ZONES;
}
