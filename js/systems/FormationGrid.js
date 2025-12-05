/**
 * FormationGrid - Gère la grille de positionnement tactique 2x3
 * 
 * Positions:
 * [0] [3]  <- Top
 * [1] [4]  <- Mid
 * [2] [5]  <- Bot
 * 
 * Front: 0-2
 * Back: 3-5
 */
export default class FormationGrid {
    constructor() {
        // 6 positions: 0-2 Front Line, 3-5 Back Line
        this.positions = new Array(6).fill(null);
    }

    /**
     * Place une unité à une position donnée
     * @param {Unit} unit - L'unité à placer
     * @param {number} position - Position (0-5)
     * @returns {boolean} - Succès du placement
     */
    placeUnit(unit, position) {
        if (position < 0 || position > 5) {
            console.warn(`Position invalide: ${position}`);
            return false;
        }

        if (this.positions[position] !== null) {
            console.warn(`Position ${position} déjà occupée`);
            return false;
        }

        this.positions[position] = unit;
        unit.position = position;
        console.log(`${unit.name} placé en position ${position} (${this.getPositionName(position)})`);
        return true;
    }

    /**
     * Retire une unité d'une position
     * @param {number} position - Position à libérer
     * @returns {Unit|null} - L'unité retirée
     */
    removeUnit(position) {
        const unit = this.positions[position];
        if (unit) {
            this.positions[position] = null;
            unit.position = null;
        }
        return unit;
    }

    /**
     * Échange deux unités de position
     * @param {number} pos1 - Première position
     * @param {number} pos2 - Deuxième position
     */
    swapPositions(pos1, pos2) {
        const temp = this.positions[pos1];
        this.positions[pos1] = this.positions[pos2];
        this.positions[pos2] = temp;

        if (this.positions[pos1]) this.positions[pos1].position = pos1;
        if (this.positions[pos2]) this.positions[pos2].position = pos2;

        console.log(`Swap: Position ${pos1} ↔ Position ${pos2}`);
    }

    /**
     * Vérifie si une position est en Front Line
     * @param {number} position - Position à vérifier
     * @returns {boolean}
     */
    isFrontLine(position) {
        return position >= 0 && position <= 2;
    }

    /**
     * Vérifie si une position est en Back Line
     * @param {number} position - Position à vérifier
     * @returns {boolean}
     */
    isBackLine(position) {
        return position >= 3 && position <= 5;
    }

    /**
     * Récupère toutes les unités de la Front Line vivantes
     * @returns {Array<Unit>}
     */
    getFrontLineUnits() {
        return this.positions.slice(0, 3).filter(u => u && !u.isDead());
    }

    /**
     * Récupère toutes les unités de la Back Line vivantes
     * @returns {Array<Unit>}
     */
    getBackLineUnits() {
        return this.positions.slice(3, 6).filter(u => u && !u.isDead());
    }

    /**
     * Récupère toutes les unités vivantes
     * @returns {Array<Unit>}
     */
    getAllUnits() {
        return this.positions.filter(u => u && !u.isDead());
    }

    /**
     * Vérifie si un attaquant peut cibler une position
     * @param {number} targetPos - Position de la cible
     * @param {string} attackerClass - Classe de l'attaquant
     * @returns {boolean}
     */
    canTargetPosition(targetPos, attackerClass) {
        const target = this.positions[targetPos];
        if (!target || target.isDead()) return false;

        const targetIsFront = this.isFrontLine(targetPos);
        const frontLineAlive = this.getFrontLineUnits().length > 0;

        // Assassins peuvent toujours cibler Back Line
        if (attackerClass === 'Assassin') {
            return true;
        }

        // Si Front Line vivante, ne peut cibler que Front
        if (frontLineAlive && !targetIsFront) {
            return false;
        }

        return true;
    }

    /**
     * Récupère toutes les cibles valides pour un attaquant
     * @param {string} attackerClass - Classe de l'attaquant
     * @returns {Array<Unit>}
     */
    getValidTargets(attackerClass) {
        const validTargets = [];

        for (let i = 0; i < 6; i++) {
            if (this.canTargetPosition(i, attackerClass)) {
                validTargets.push(this.positions[i]);
            }
        }

        return validTargets;
    }

    /**
     * Obtient le nom descriptif d'une position
     * @param {number} position - Position (0-5)
     * @returns {string}
     */
    getPositionName(position) {
        const names = [
            'Front-Top', 'Front-Mid', 'Front-Bot',
            'Back-Top', 'Back-Mid', 'Back-Bot'
        ];
        return names[position] || 'Unknown';
    }

    /**
     * Obtient les coordonnées visuelles pour une position
     * @param {number} position - Position (0-5)
     * @param {number} baseX - X de base
     * @param {number} baseY - Y de base
     * @param {number} spacing - Espacement
     * @returns {Object} - {x, y}
     */
    getPositionCoordinates(position, baseX, baseY, spacing = 120) {
        const row = position % 3; // 0, 1, 2
        const col = Math.floor(position / 3); // 0 (Front) ou 1 (Back)

        return {
            x: baseX + (col * spacing * 2),
            y: baseY + (row * spacing)
        };
    }

    /**
     * Déplace une unité de Front vers Back (Push)
     * @param {number} position - Position actuelle (doit être Front)
     * @returns {boolean}
     */
    pushToBack(position) {
        if (!this.isFrontLine(position)) return false;

        const backPos = position + 3; // 0->3, 1->4, 2->5
        if (this.positions[backPos] !== null) return false;

        const unit = this.positions[position];
        this.positions[position] = null;
        this.positions[backPos] = unit;
        unit.position = backPos;

        console.log(`${unit.name} poussé vers Back Line (${this.getPositionName(backPos)})`);
        return true;
    }

    /**
     * Tire une unité de Back vers Front (Pull)
     * @param {number} position - Position actuelle (doit être Back)
     * @returns {boolean}
     */
    pullToFront(position) {
        if (!this.isBackLine(position)) return false;

        const frontPos = position - 3; // 3->0, 4->1, 5->2
        if (this.positions[frontPos] !== null) return false;

        const unit = this.positions[position];
        this.positions[position] = null;
        this.positions[frontPos] = unit;
        unit.position = frontPos;

        console.log(`${unit.name} tiré vers Front Line (${this.getPositionName(frontPos)})`);
        return true;
    }

    /**
     * Réinitialise la grille
     */
    reset() {
        this.positions.fill(null);
    }

    /**
     * Clone la formation
     * @returns {FormationGrid}
     */
    clone() {
        const newGrid = new FormationGrid();
        newGrid.positions = [...this.positions];
        return newGrid;
    }
}
