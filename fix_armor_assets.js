const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = path.join(__dirname, 'assets', 'Assets_création', 'Armures');
const DEST_ROOT = path.join(__dirname, 'assets', 'items', 'armor');

// Mapping: Source Subfolder -> Destination Armor Type
const TYPE_MAPPING = {
    'Cuir': 'leather',
    'Plaque': 'plate',
    'Tissu': 'cloth'
};

// Sub-sub folders that contain the actual images
// They might be named differently in each: 'Amures' (typo), 'Plastrons', 'Bottes', 'Casques'
const SLOT_FOLDERS = ['Amures', 'Plastrons', 'Bottes', 'Casques'];

function normalizeFilename(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "_")
        .replace(/_+/g, "_");
}

function moveFiles(sourcePath, destPath) {
    if (!fs.existsSync(sourcePath)) return;
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });

    const files = fs.readdirSync(sourcePath);
    files.forEach(file => {
        if (file.endsWith('.png') || file.endsWith('.jpg')) {
            const oldPath = path.join(sourcePath, file);
            const newName = normalizeFilename(file);
            const newPath = path.join(destPath, newName);

            // Copy instead of move for safety during testing
            fs.copyFileSync(oldPath, newPath);
            console.log(`Copied: ${file} -> ${path.relative(__dirname, newPath)}`);
        }
    });
}

// Ensure destination directories exist
Object.values(TYPE_MAPPING).forEach(type => {
    fs.mkdirSync(path.join(DEST_ROOT, type), { recursive: true });
});

// Iterate through types (Cuir, Plaque, Tissu)
Object.keys(TYPE_MAPPING).forEach(sourceType => {
    const destType = TYPE_MAPPING[sourceType];
    const typeFolderPath = path.join(SOURCE_ROOT, sourceType);

    if (!fs.existsSync(typeFolderPath)) {
        console.warn(`Source folder not found: ${typeFolderPath}`);
        return;
    }

    // Iterate through slots (Amures, Bottes, Casques...)
    SLOT_FOLDERS.forEach(slotFolder => {
        const slotPath = path.join(typeFolderPath, slotFolder);

        // Target is simply armor/{type}/ because AssetManager only differentiates by material type
        // e.g. armor/leather implies all leather gear (helm, chest, boots)
        const targetPath = path.join(DEST_ROOT, destType);

        moveFiles(slotPath, targetPath);
    });
});

console.log('Armor migration complete.');
