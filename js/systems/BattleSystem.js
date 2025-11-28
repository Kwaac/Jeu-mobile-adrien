import Unit from '../entities/Unit.js';

export default class BattleSystem {
    constructor(game) {
        this.game = game;
        this.playerUnits = [];
        this.enemyUnits = [];
        this.waveIndex = 0;
        this.turnState = 'PLAYER_PHASE'; // PLAYER_PHASE, ENEMY_PHASE, VICTORY, DEFEAT
        this.actionQueue = []; // For handling simultaneous attacks/animations
    }

    initTestBattle() {
        // Placeholder for testing without QuestSystem if needed
    }

    startWave(enemyDataArray) {
        this.enemyUnits = enemyDataArray.map((data, index) => {
            const unit = new Unit(data.name, false, data);
            // Position enemies on the left/top or right/top depending on design
            // Brave Frontier: Enemies top-right/center, Players bottom-left
            unit.x = this.game.width * 0.6 + (index % 2) * 60;
            unit.y = this.game.height * 0.2 + Math.floor(index / 2) * 80;
            return unit;
        });

        // Setup Player Units (if not already set, usually persistent)
        if (this.playerUnits.length === 0) {
            // Utiliser l'équipe du PartyManager
            this.playerUnits = this.game.partyManager.getParty().slice(); // Clone pour éviter les références
            console.log(`Équipe de combat chargée : ${this.playerUnits.length} unités`);
        }

        // Position Player Units
        this.playerUnits.forEach((unit, index) => {
            unit.x = this.game.width * 0.2 + (index % 2) * 60;
            unit.y = this.game.height * 0.6 + Math.floor(index / 2) * 80;
        });

        this.turnState = 'PLAYER_PHASE';
        this.game.uiManager.updateBattleInfo('Phase Joueur - Tapez sur vos unités pour attaquer !');
        console.log("Vague commencée", this.enemyUnits);
    }

    update(deltaTime) {
        // Update all units (animations, etc.)
        [...this.playerUnits, ...this.enemyUnits].forEach(unit => {
            // unit.update(deltaTime); // If Unit has update method
        });

        if (this.turnState === 'ENEMY_PHASE') {
            this.handleEnemyTurn();
        }

        // Check for dead units
        this.enemyUnits = this.enemyUnits.filter(u => !u.isDead());

        if (this.enemyUnits.length === 0 && this.turnState !== 'VICTORY') {
            this.handleWaveClear();
        }

        if (this.playerUnits.every(u => u.isDead()) && this.turnState !== 'DEFEAT') {
            this.handleDefeat();
        }
    }

    handleInput(x, y) {
        if (this.turnState !== 'PLAYER_PHASE') return;

        // Check if a player unit was clicked
        this.playerUnits.forEach(unit => {
            if (!unit.hasActed &&
                x >= unit.x && x <= unit.x + unit.width &&
                y >= unit.y && y <= unit.y + unit.height) {

                this.executePlayerAttack(unit);
            }
        });
    }

    executePlayerAttack(unit) {
        // Check if BB is ready and used
        if (unit.isBbReady()) {
            this.executePlayerBB(unit);
            return;
        }

        // Normal Attack
        const target = this.enemyUnits[0];
        if (target) {
            unit.hasActed = true;
            console.log(`${unit.name} attaque ${target.name} !`);

            const damage = unit.attack(target);
            this.game.uiManager.showDamageNumber(target.x, target.y, damage);

            // Generate Battle Crystals (BC)
            this.generateBattleCrystals(damage);

            this.checkTurnEnd();
        }
    }

    executePlayerBB(unit) {
        unit.hasActed = true;
        this.game.uiManager.showBattleMessage(`${unit.name} utilise son BB !`);

        // BB hits all enemies
        const damageTotal = unit.executeBB(this.enemyUnits);

        // Show damage on all enemies
        this.enemyUnits.forEach(enemy => {
            // We don't have exact damage per enemy from executeBB yet, simplifying for visual
            // In a real app, executeBB should return a map of damage
            this.game.uiManager.showDamageNumber(enemy.x, enemy.y, "BB!", "gold");
        });

        this.checkTurnEnd();
    }

    generateBattleCrystals(damage) {
        // Simple logic: 1 BC per hit (or based on damage)
        // Distribute BC to random units
        const bcCount = Math.max(1, Math.floor(damage / 5)); // 1 BC per 5 damage

        for (let i = 0; i < bcCount; i++) {
            const receiver = this.playerUnits[Math.floor(Math.random() * this.playerUnits.length)];
            if (!receiver.isDead()) {
                receiver.fillBbGauge(5); // 5 gauge per BC
            }
        }
    }

    checkTurnEnd() {
        if (this.playerUnits.every(u => u.hasActed)) {
            setTimeout(() => this.startEnemyTurn(), 1000);
        }
    }

    startEnemyTurn() {
        this.turnState = 'ENEMY_PHASE';
        this.game.uiManager.updateBattleInfo('Phase Ennemie');
    }

    handleEnemyTurn() {
        // Simple AI: Each enemy attacks a random player
        this.enemyUnits.forEach(enemy => {
            const target = this.playerUnits[Math.floor(Math.random() * this.playerUnits.length)];
            if (target && !target.isDead()) {
                const damage = enemy.attack(target);
                console.log(`${enemy.name} attaque ${target.name} pour ${damage} dégâts`);
                this.game.uiManager.showDamageNumber(target.x, target.y, damage, 'red');
            }
        });

        // Reset Player States
        this.playerUnits.forEach(u => u.hasActed = false);

        // Back to Player Phase
        this.turnState = 'PLAYER_PHASE';
        this.game.uiManager.updateBattleInfo('Phase Joueur');
    }

    handleWaveClear() {
        this.turnState = 'VICTORY'; // Temporary state before next wave
        console.log("Vague terminée !");

        // Award XP to surviving players
        const xpPerEnemy = 50; // Base XP per enemy
        const totalXp = this.enemyUnits.length * xpPerEnemy;

        this.playerUnits.forEach(unit => {
            if (!unit.isDead()) {
                unit.gainXp(totalXp);
            }
        });

        setTimeout(() => {
            this.game.questSystem.nextWave();
        }, 1500);
    }

    handleDefeat() {
        this.turnState = 'DEFEAT';
        this.game.endBattle(false);
    }

    draw(ctx) {
        // Draw Units
        [...this.enemyUnits, ...this.playerUnits].forEach(unit => {
            unit.draw(ctx);
            // Draw "Done" indicator if acted
            if (unit.hasActed) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(unit.x, unit.y, unit.width, unit.height);
            }
        });
    }
}
