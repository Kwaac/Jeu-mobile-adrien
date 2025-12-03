import Item from './Item.js';

export default class Equipment extends Item {
    constructor(id, name, description, slot, stats, stars = 1) {
        super(id, name, description, 'equipment');
        this.slot = slot; // 'weapon', 'armor', 'accessory'
        this.stars = stars; // 1-7 étoiles
        this.baseStats = { ...stats }; // Stats de base (1★)
        this.stats = this.calculateStats(); // Stats actuelles selon les étoiles
        this.level = 0;
        this.maxLevel = 10;
    }

    /**
     * Calcule les stats selon le niveau d'étoiles
     * @returns {Object} Stats calculées
     */
    calculateStats() {
        const multiplier = Math.pow(1.2, this.stars - 1); // +20% par étoile
        const calculatedStats = {};

        for (let stat in this.baseStats) {
            calculatedStats[stat] = Math.floor(this.baseStats[stat] * multiplier);
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
