const fs = require('fs');
const path = require('path');

const SOURCE_ROBES = path.join(__dirname, 'assets', 'Assets_création', 'Armures', 'Tissu', 'Robes');
const DEST_CLOTH = path.join(__dirname, 'assets', 'items', 'armor', 'cloth');

if (!fs.existsSync(SOURCE_ROBES)) {
    console.error("Robes folder not found!");
    process.exit(1);
}

// Data for renaming
const CLOTH_CHESTS = [
    'Robe en Lin', 'Tunique de Laine', 'Robe de Coton', 'Robe de Soie', 'Robe d\'Apprenti',
    'Robe de Mage', 'Toge de Prêtre', 'Robe de Sorcier', 'Tissu Enchanté', 'Robe Mystique',
    'Robe de l\'Oracle', 'Tissu de Givre', 'Robe de l\'Ombre', 'Tissu Igné', 'Robe du Néant',
    'Tissu Runique', 'Soie de Dragon', 'Robe Céleste', 'Linceul du Vide', 'Toge d\'Eternité'
];

function normalizeFilename(name) {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9.]+/g, "_").replace(/_+/g, "_");
}

const files = fs.readdirSync(SOURCE_ROBES);
console.log(`Found ${files.length} robes.`);

files.forEach(file => {
    if (!file.endsWith('.png')) return;

    // Copy
    const srcPath = path.join(SOURCE_ROBES, file);
    const normalizedName = normalizeFilename(file);
    const destPath = path.join(DEST_CLOTH, normalizedName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file} -> ${normalizedName}`);

    // Rename logic
    const lowerFile = normalizedName.replace(/^robe_|^toge_|^tissu_/, ''); // strip prefix behavior roughly

    for (const itemName of CLOTH_CHESTS) {
        const expected = normalizeFilename(itemName) + '.png';
        const expectedNorm = normalizeFilename(itemName);

        // Check match
        if (normalizedName === expected) continue;

        // Fuzzy
        if (normalizedName.includes(expectedNorm) || lowerFile.includes(expectedNorm)) {
            const finalPath = path.join(DEST_CLOTH, expected);
            if (destPath !== finalPath) {
                fs.renameSync(destPath, finalPath);
                console.log(`Renamed to: ${expected}`);
            }
            break;
        }
    }
});
