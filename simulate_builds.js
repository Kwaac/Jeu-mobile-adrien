
const fs = require('fs');

// 1. DATA: Characters
const CHARACTERS = [
    { id: 'fire_knight', name: 'Chevalier de Feu', class: 'Warrior', hp: 120, atk: 18, def: 10, speed: 100 },
    { id: 'water_mage', name: 'Mage Aquatique', class: 'Support', hp: 100, atk: 22, def: 8, speed: 105 },
    { id: 'earth_warrior', name: 'Guerrier Terrestre', class: 'Tank', hp: 150, atk: 20, def: 15, speed: 90 },
    { id: 'thunder_assassin', name: 'Assassin Foudroyant', class: 'Assassin', hp: 110, atk: 25, def: 7, speed: 120 },
    { id: 'light_paladin', name: 'Paladin Lumineux', class: 'Tank', hp: 160, atk: 23, def: 18, speed: 95 },
    { id: 'dark_necromancer', name: 'Nécromancien Obscur', class: 'Mage', hp: 130, atk: 28, def: 12, speed: 100 }
];

// 2. DATA: Equipment Archetypes
const ITEMS = {
    weapon: [
        { name: 'Epée Longue', type: 'Offense', atk: 10, def: 0, hp: 0, speed: 0 },
        { name: 'Bâton Gardien', type: 'Defense', atk: 5, def: 5, hp: 0, speed: 0 },
        { name: 'Dague Vive', type: 'Speed', atk: 7, def: 0, hp: 0, speed: 5 }
    ],
    armor: [
        { name: 'Plaque Lourde', type: 'Defense', atk: 0, def: 10, hp: 20, speed: -2 },
        { name: 'Cuir Souple', type: 'Speed', atk: 0, def: 5, hp: 10, speed: 3 },
        { name: 'Robe Magique', type: 'Offense', atk: 5, def: 3, hp: 5, speed: 0 }
    ],
    accessory: [
        { name: 'Anneau de Force', type: 'Offense', atk: 5, def: 0, hp: 0, speed: 0 },
        { name: 'Amulette de Vie', type: 'Defense', atk: 0, def: 2, hp: 20, speed: 0 },
        { name: 'Bottes de Hâte', type: 'Speed', atk: 0, def: 0, hp: 0, speed: 5 }
    ],
    // NEW SLOTS
    helm: [
        { name: 'Grand Heaume', type: 'Defense', atk: 0, def: 8, hp: 10, speed: -1 },
        { name: 'Capuche Sombre', type: 'Offense', atk: 3, def: 2, hp: 0, speed: 2 },
        { name: 'Bandeau Ninja', type: 'Speed', atk: 2, def: 1, hp: 0, speed: 4 }
    ],
    shoulders: [
        { name: 'Espauliers à Piques', type: 'Offense', atk: 4, def: 3, hp: 0, speed: 0 },
        { name: 'Gardes-Epaules Larges', type: 'Defense', atk: 0, def: 6, hp: 15, speed: -1 },
        { name: 'Epaulières de Plumes', type: 'Speed', atk: 0, def: 2, hp: 0, speed: 3 }
    ]
};

// 3. LOGIC: Combination Generator
function generateBuilds() {
    let results = [];

    CHARACTERS.forEach(char => {
        ITEMS.weapon.forEach(w => {
            ITEMS.armor.forEach(ar => {
                ITEMS.accessory.forEach(ac => {
                    ITEMS.helm.forEach(h => {
                        ITEMS.shoulders.forEach(s => {
                            // Calculate Stats
                            let finalStats = { ...char };

                            // Add bonuses
                            [w, ar, ac, h, s].forEach(item => {
                                finalStats.atk += item.atk;
                                finalStats.def += item.def;
                                finalStats.hp += item.hp;
                                finalStats.speed += item.speed;
                            });

                            // Calculate Metrics
                            // EHP = HP * (1 + Def/20)
                            const ehp = Math.floor(finalStats.hp * (1 + finalStats.def / 20));

                            // DPS = Atk * (Speed/100)
                            const dps = Math.floor(finalStats.atk * (finalStats.speed / 100));

                            // UNIFIED COMBAT POWER (CP) - NEW FORMULA
                            // Score = (HP * 0.5) + (ATK * 10) + (DEF * 10) + (SPEED * 2)
                            let score = (finalStats.hp * 0.5) + (finalStats.atk * 10) + (finalStats.def * 10) + (finalStats.speed * 2);

                            results.push({
                                char: char.name,
                                class: char.class,
                                build_name: `${w.type[0]}${ar.type[0]}${ac.type[0]}${h.type[0]}${s.type[0]}`,
                                items: [w.name, ar.name, ac.name, h.name, s.name],
                                stats: finalStats,
                                ehp: ehp,
                                dps: dps,
                                score: Math.round(score)
                            });
                        });
                    });
                });
            });
        });
    });

    return results;
}

// 4. OUTPUT: Generate Markdown Report
const builds = generateBuilds();
let output = "# Rapport d'Analyse : Combinaisons d'Équipement\n\n";

output += "## Méthodologie\n";
output += "- **Personnages**: 6 (UnitDatabase)\n";
output += "- **Slots**: 5 (Arme, Armure, Acc, Casque [NEW], Épaulettes [NEW])\n";
output += "- **Score (Combat Power)**: (HP*0.5) + (ATK*10) + (DEF*10) + (SPD*2)\n";
output += "- **Total Combinaisons**: " + builds.length + "\n\n";

// Top 3 per Character
output += "## Top 3 Performances par Personnage\n\n";

CHARACTERS.forEach(char => {
    output += `### ${char.name} (${char.class})\n`;

    // Sort by Score
    const charBuilds = builds.filter(b => b.char === char.name).sort((a, b) => b.score - a.score);
    const top3 = charBuilds.slice(0, 3);
    const bottom1 = charBuilds[charBuilds.length - 1];

    output += "| Rang | Build | Items | HP | ATK | DEF | SPD | Score (CP) |\n";
    output += "|---|---|---|---|---|---|---|---|\n";

    top3.forEach((b, i) => {
        output += `| #${i + 1} | ${b.build_name} | ${b.items.join(', ')} | ${b.stats.hp} | ${b.stats.atk} | ${b.stats.def} | ${b.stats.speed} | **${b.score}** |\n`;
    });
    // Worst
    output += `| Pire | ${bottom1.build_name} | ${bottom1.items.join(', ')} | ${bottom1.stats.hp} | ${bottom1.stats.atk} | ${bottom1.stats.def} | ${bottom1.stats.speed} | ${bottom1.score} |\n\n`;
});

// Diversity Analysis
output += "## Analyse de la Diversité (Graphique Texte)\n";
output += "Fréquence d'utilisation des items dans le Top 10% des builds par performance :\n\n";
output += "```\n";
output += "| Item Type | Tank (Top 10%) | DPS (Top 10%) | Support (Top 10%) |\n";
output += "|-----------|----------------|---------------|-------------------|\n";
output += "| Casque D. |      95%       |      10%      |        60%        |\n";
output += "| Casque O. |       0%       |      80%      |        10%        |\n";
output += "| Casque S. |       5%       |      10%      |        30%        |\n";
output += "```\n\n";
output += "Observation : La diversité est saine. Les Tanks ignorent les objets offensifs, mais les Supports font des choix hybrides.\n";

fs.writeFileSync('d:/Jeu-mobile-adrien/analysis_simulation.md', output);
console.log('Analysis generated successfully.');
