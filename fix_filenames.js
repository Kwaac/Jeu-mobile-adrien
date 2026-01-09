const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'assets', 'items', 'armor');

// DATA MOCK (Simplified from armors.js)
const ARMOR_DATA = {
    plate: [
        'Plastron Rouillé', 'Plastron de Fer', 'Cotte de Mailles', 'Armure de Soldat',
        'Armure de Chevalier', 'Armure Lourde', 'Plaques d\'Acier', 'Armure de Gardien',
        'Plaques Renforcées', 'Armure de Paladin', 'Armure de Mithril', 'Plaques de Givre',
        'Plaques de Magma', 'Plaques des Ténèbres', 'Armure de Diamant', 'Armure Runique',
        'Ecaille de Dragon', 'Armure Céleste', 'Plaques du Vide', 'Forteresse Mobile'
    ],
    leather: [
        'Tunique en Peau', 'Armure de Cuir', 'Cuir Clouté', 'Cuir Bouilli', 'Cuir de Loup',
        'Armure de Voleur', 'Cuir Renforcé', 'Cuir de Chasseur', 'Armure d\'Assassin',
        'Cuir de Bête', 'Peau de Troll', 'Cuir de Glace', 'Cuir Infernal', 'Manteau d\'Ombre',
        'Cuir de Démon', 'Cuir Runique', 'Peau de Dragon', 'Veste Céleste', 'Cuir du Vide',
        'Ombre Divine'
    ],
    cloth: [
        'Robe en Lin', 'Tunique de Laine', 'Robe de Coton', 'Robe de Soie', 'Robe d\'Apprenti',
        'Robe de Mage', 'Toge de Prêtre', 'Robe de Sorcier', 'Tissu Enchanté', 'Robe Mystique',
        'Robe de l\'Oracle', 'Tissu de Givre', 'Robe de l\'Ombre', 'Tissu Igné', 'Robe du Néant',
        'Tissu Runique', 'Soie de Dragon', 'Robe Céleste', 'Linceul du Vide', 'Toge d\'Eternité'
    ]
};

const HELM_DATA = {
    plate: ['Cervelière', 'Casque de Fer', 'Bassinet', 'Salade' /* ... add more if needed for strict check */],
    leather: ['Bandeau de Cuir', 'Calotte'],
    cloth: ['Ruban', 'Bandeau']
};
// NOTE: For brevity, focusing on fixing the main armor mismatches first. 
// The logic will be generic: try to find a file relative to the item name.

function normalizeFilename(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "_")
        .replace(/_+/g, "_");
}

function processCategory(type, itemNames) {
    const dir = path.join(BASE_DIR, type);
    if (!fs.existsSync(dir)) {
        console.log(`Skipping ${dir} - not found`);
        return;
    }

    const files = fs.readdirSync(dir);
    console.log(`Processing ${type} (${files.length} files)...`);

    itemNames.forEach(itemName => {
        const expectedName = normalizeFilename(itemName) + '.png';
        const expectedPath = path.join(dir, expectedName);

        if (fs.existsSync(expectedPath)) {
            // Already correct
            return;
        }

        // Try to find a match
        // Heuristic: remove "amure_", "plastron_", "de_" from file names and see if it matches "normalized item name"
        // Or check if filename *contains* the key parts of the item name.

        let bestMatch = null;
        const normalizedItem = normalizeFilename(itemName); // e.g. "tunique_en_peau"

        // specific fixes
        const candidates = files.filter(f => {
            const normFile = f.toLowerCase();

            // Exact containment check (file contains the item name)
            if (normFile.includes(normalizedItem)) return true;

            // Fuzzy check: "amure_tunique_en_peau.png" vs "tunique_en_peau"
            // If we strip "amure_" prefix
            if (normFile.replace(/^amure_|^armure_|^plastron_/, '').includes(normalizedItem)) return true;

            // If we strip "de " words from item name? "Armure de Cuir" -> "armure_cuir"
            // "armure_de_cuir" -> "armure_cuir"
            const simplifiedItem = normalizedItem.replace(/_de_/g, '_').replace(/_en_/g, '_');
            const simplifiedFile = normFile.replace(/_de_/g, '_').replace(/_en_/g, '_');

            if (simplifiedFile.includes(simplifiedItem)) return true;

            return false;
        });

        if (candidates.length === 1) {
            bestMatch = candidates[0];
        } else if (candidates.length > 1) {
            // Pick the shortest match (least likely to be a "bonus" variant if existing)
            // or just the one that starts with it?
            bestMatch = candidates.sort((a, b) => a.length - b.length)[0];
        }

        if (bestMatch) {
            const oldPath = path.join(dir, bestMatch);
            console.log(`Renaming: ${bestMatch} -> ${expectedName}`);
            fs.renameSync(oldPath, expectedPath);
        } else {
            console.log(`Missing asset for: ${itemName} (Expected: ${expectedName})`);
        }
    });
}

// Run
processCategory('leather', ARMOR_DATA.leather);
processCategory('plate', ARMOR_DATA.plate);
processCategory('cloth', ARMOR_DATA.cloth);
