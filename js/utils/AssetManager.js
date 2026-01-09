/**
 * AssetManager.js
 * Gère la résolution des chemins d'assets pour les objets du jeu.
 */

export const AssetManager = {
    /**
     * Retourne le chemin de l'icône pour un objet donné.
     * @param {Object} item - L'objet (arme, armure, accessoire)
     * @returns {string} Le chemin relatif de l'image
     */
    getItemIconPath(item) {
        if (!item || !item.name) return 'assets/items/unknown.png'; // Fallback

        // 1. Normaliser le nom (Même logique que le script de migration Python)
        const normalizedName = this.normalizeFilename(item.name);

        // 2. Déterminer le dossier de base
        const folder = this.getItemFolder(item);

        return `assets/items/${folder}/${normalizedName}.png`;
    },

    /**
     * Normalise le nom de fichier (ex: "Épée de Bois" -> "epee_de_bois")
     */
    normalizeFilename(name) {
        return name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")    // Remplace char spéciaux par _
            .replace(/^_+|_+$/g, "");       // Trim _
    },

    /**
     * Détermine le sous-dossier en fonction du type d'objet
     */
    getItemFolder(item) {
        // Types d'armes (défini dans weapons.js keys)
        const weaponTypes = ['sword', 'axe', 'dagger', 'mace', 'staff', 'bow', 'spear'];

        // Types d'armures
        const armorTypes = ['plate', 'leather', 'cloth'];

        // 1. Direct Type Match
        if (weaponTypes.includes(item.type)) {
            return `weapon/${item.type}`;
        }
        if (armorTypes.includes(item.type)) {
            return `armor/${item.type}`;
        }
        if (item.type === 'accessory' || item.type === 'ring' || item.type === 'amulet') {
            return 'accessory';
        }

        // 2. Heuristic for Armor (if type is generic 'armor', 'helm', 'boots')
        if (['armor', 'helm', 'boots'].includes(item.type) || item.slot === 'armor') {
            const keywords = (item.id + ' ' + item.name).toLowerCase();

            // Check for Plate keywords
            if (keywords.match(/plate|plaque|maille|fer|acier|soldat|chevalier|paladin|lourd|givre|magma|ténébres|diamant|dragon|céleste|vide|mithril/)) {
                return 'armor/plate';
            }
            // Check for Leather keywords
            if (keywords.match(/leather|cuir|peau|voleur|chasseur|assassin|bête|troll|demon|démo|ombre|brigand/)) {
                return 'armor/leather';
            }
            // Check for Cloth keywords
            if (keywords.match(/cloth|tissu|robe|soie|lin|laine|mage|prêtre|sorcier|enchanté|mystique|oracle/)) {
                return 'armor/cloth';
            }
            // Default to leather if unsure? Or maybe just try root 'armor'?
            // Let's default to 'armor/leather' as median
            return 'armor/leather';
        }

        return 'misc';
    }
};
