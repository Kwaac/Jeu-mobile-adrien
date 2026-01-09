/**
 * ACCESSORY DATA
 * 60 Objets (3 options par Tier de 1 à 20)
 * Inclut des stats classiques et des résistances/immunités
 */

export const ACCESSORY_DATA = [
    // --- TIER 1 ---
    { tier: 1, name: 'Anneau de Cuivre', stats: { atk: 1 } },
    { tier: 1, name: 'Amulette de Purge', stats: { hp: 10, res_poison: 10 } },
    { tier: 1, name: 'Anneau de Pierre', stats: { def: 1, res_bleed: 10 } },

    // --- TIER 2 ---
    { tier: 2, name: 'Pendentif en Bois', stats: { hp: 5 } },
    { tier: 2, name: 'Bague de Rosée', stats: { mp: 5, res_burn: 10 } },
    { tier: 2, name: 'Bracelet d\'Eveil', stats: { atk: 2, res_sleep: 10 } },

    // --- TIER 3 ---
    { tier: 3, name: 'Bracelet de Cuir', stats: { def: 1 } },
    { tier: 3, name: 'Collier Anti-Venin', stats: { hp: 20, def: 2, res_poison: 20 } },
    { tier: 3, name: 'Ceinture de Plomb', stats: { def: 3, res_stun: 10 } },

    // --- TIER 4 ---
    { tier: 4, name: 'Bague d\'Argent', stats: { atk: 3 } },
    { tier: 4, name: 'Pendentif de Clarté', stats: { acc: 5, res_blind: 20 } },
    { tier: 4, name: 'Anneau de Garde', stats: { def: 4, res_poison: 10 } },

    // --- TIER 5 ---
    { tier: 5, name: 'Talisman de Chance', stats: { crit_rate: 1 } },
    { tier: 5, name: 'Talisman Ignifugé', stats: { hp: 30, res_fire: 10, res_burn: 25 } },
    { tier: 5, name: 'Boucle de Vent', stats: { speed: 2, res_silence: 15 } },

    // --- TIER 6 ---
    { tier: 6, name: 'Collier de Dents', stats: { atk: 5 } },
    { tier: 6, name: 'Amulette de Sang', stats: { lifesteal: 1, res_bleed: 25, hp: 40 } },
    { tier: 6, name: 'Anneau Polaire', stats: { res_water: 10, res_freeze: 20 } },

    // --- TIER 7 ---
    { tier: 7, name: 'Ceinture de Force', stats: { hp: 20 } },
    { tier: 7, name: 'Ceinturon de Fer', stats: { def: 8, res_stun: 20 } },
    { tier: 7, name: 'Bague de l\'Aigle', stats: { acc: 10, res_blind: 30 } },

    // --- TIER 8 ---
    { tier: 8, name: 'Anneau d\'Or', stats: { atk: 8 } },
    { tier: 8, name: 'Pendentif Purificateur', stats: { heal_power: 5, res_poison: 50 } },
    { tier: 8, name: 'Bracelet Miroir', stats: { def: 5, res_curse: 15 } },

    // --- TIER 9 ---
    { tier: 9, name: 'Médaille de Bravoure', stats: { def: 5, hp: 10 } },
    { tier: 9, name: 'Collier de Volonté', stats: { atk: 5, res_silence: 30 } },
    { tier: 9, name: 'Sceau de Courage', stats: { hp: 50, res_fear: 25 } },

    // --- TIER 10 ---
    { tier: 10, name: 'Sceau du Roi', stats: { atk: 10, def: 5 } },
    { tier: 10, name: 'Egide de l\'Esprit', stats: { mp: 20, def: 10, res_confuse: 20 } },
    { tier: 10, name: 'Coeur de Pierre', stats: { hp: 100, def: 10, immune_bleed: 1 } },

    // --- TIER 11 ---
    { tier: 11, name: 'Amulette de l\'Ombre', stats: { speed: 5 } },
    { tier: 11, name: 'Anneau Solaire', stats: { hp: 60, res_fire: 20, immune_burn: 1 } },
    { tier: 11, name: 'Perle de Lune', stats: { mp: 15, immune_sleep: 1 } },

    // --- TIER 12 ---
    { tier: 12, name: 'Cristal de Givre', stats: { atk: 5, res_water: 5 } },
    { tier: 12, name: 'Talisman de Glace', stats: { def: 10, res_water: 30, immune_freeze: 1 } },
    { tier: 12, name: 'Broche de Vision', stats: { acc: 15, immune_blind: 1 } },

    // --- TIER 13 ---
    { tier: 13, name: 'Perle des Océans', stats: { heal_power: 5 } },
    { tier: 13, name: 'Ceinture de Titan', stats: { hp: 150, def: 20, immune_stun: 1 } },
    { tier: 13, name: 'Cape de Sérénité', stats: { mp: 30, immune_silence: 1 } },

    // --- TIER 14 ---
    { tier: 14, name: 'Cœur de Lave', stats: { atk: 15 } },
    { tier: 14, name: 'Amulette Sacrée', stats: { heal_power: 10, immune_curse: 1 } },
    { tier: 14, name: 'Bague de Vie', stats: { hp: 200, immune_poison: 1 } },

    // --- TIER 15 ---
    { tier: 15, name: 'Œil du Démon', stats: { lifesteal: 1 } },
    { tier: 15, name: 'Œil de la Vérité', stats: { crit_rate: 5, immune_confuse: 1 } },
    { tier: 15, name: 'Bouclier d\'Ame', stats: { def: 25, hp: 100, res_all: 10 } },

    // --- TIER 16 ---
    { tier: 16, name: 'Anneau Runique', stats: { atk: 20, hp: 30 } },
    { tier: 16, name: 'Halo de Pureté', stats: { all_stats: 5, immune_all_temp: 1 } },
    { tier: 16, name: 'Marque du Berserker', stats: { atk: 50, def: -10, immune_fear: 1 } },

    // --- TIER 17 ---
    { tier: 17, name: 'Griffe de Dragon', stats: { crit_dmg: 10 } },
    { tier: 17, name: 'Pacte de Sang', stats: { lifesteal: 5, hp: 100, immune_bleed: 1 } },
    { tier: 17, name: 'Coeur de Dragon', stats: { hp: 300, res_fire: 50, res_water: 50, immune_burn: 1 } },

    // --- TIER 18 ---
    { tier: 18, name: 'Eclat d\'Etoile', stats: { atk: 25, speed: 5 } },
    { tier: 18, name: 'Esprit du Vide', stats: { res_dark: 50, immune_silence: 1, mp: 50 } },
    { tier: 18, name: 'Lumière Intérieure', stats: { heal_power: 20, res_all: 20 } },

    // --- TIER 19 ---
    { tier: 19, name: 'Essence du Vide', stats: { atk: 30, def: 10 } },
    { tier: 19, name: 'Protection Divine', stats: { def: 40, hp: 400, immune_all_perm: 1 } },
    { tier: 19, name: 'Anneau du Chaos', stats: { atk: 100, res_all: -20, lifesteal: 2 } },

    // --- TIER 20 ---
    { tier: 20, name: 'Sceau de l\'Infini', stats: { atk: 50, all_stats: 10 } },
    { tier: 20, name: 'Aegis Ultime', stats: { def: 50, hp: 500, res_all: 15, immune_stun: 1 } },
    { tier: 20, name: 'Symbole de l\'Omniscient', stats: { atk: 60, crit_rate: 15, speed: 10, immune_blind: 1 } }
];
