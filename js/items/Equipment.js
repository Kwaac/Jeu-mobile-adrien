import Item from './Item.js';

export default class Equipment extends Item {
    constructor(id, name, description, slot, stats, stars = 1, substats = {}) {
        super(id, name, description, 'equipment');
        this.slot = slot; // 'weapon', 'armor', 'accessory', 'helm', 'boots'
        this.stars = stars; // 1-7 étoiles
        this.baseStats = { ...stats }; // Stats de base (1★)
        this.substats = { ...substats }; // Stats aléatoires (Fixes, ne scalent pas avec les étoiles pour l'instant)
        // Note: Substats could scale, but typically in RPGs they are separate or scale differently.
        // For simplicity V2: Substats are fixed on generation, Reforging rerolls them.

        this.stats = this.calculateStats(); // Stats actuelles (Base Scaled + Substats)
        this.level = 0;
        this.maxLevel = 10;
    }

    /**
     * Calcule les stats selon le niveau d'étoiles + Niveau (1-10) + Substats
     * @returns {Object} Stats calculées
     */
    calculateStats() {
        const starMultiplier = Math.pow(1.2, this.stars - 1); // +20% par étoile
        const levelMultiplier = 1 + (this.level * 0.1); // +10% par niveau (Max +100% au niveau 10)

        const calculatedStats = {};

        // 1. Stats de Base (Scaled with Stars AND Level)
        for (let stat in this.baseStats) {
            let val = this.baseStats[stat] * starMultiplier * levelMultiplier;
            calculatedStats[stat] = Math.floor(val);
        }

        // 2. Substats (Fixed for now, or could scale?)
        // Let's keep substats fixed to differentiate their value, or scale them too?
        // Usually substats scale with "Enhancement" (+3, +6...).
        // User asked "monter de level". Let's scale everything for impact!
        // Actually, let's keep substats fixed for simplicity of generation, but scale base stats well.
        for (let stat in this.substats) {
            if (calculatedStats[stat]) {
                calculatedStats[stat] += this.substats[stat];
            } else {
                calculatedStats[stat] = this.substats[stat];
            }
        }

        return calculatedStats;
    }

    /**
     * Retourne l'affichage des étoiles
     * @returns {string}
     */
    getStarDisplay() {
        return '★'.repeat(this.stars);
    }

    /**
     * Met à jour le niveau d'étoiles et recalcule les stats
     * @param {number} newStars - Nouveau niveau d'étoiles
     */
    setStars(newStars) {
        this.stars = Math.min(7, Math.max(1, newStars));
        this.stats = this.calculateStats();
    }
}
