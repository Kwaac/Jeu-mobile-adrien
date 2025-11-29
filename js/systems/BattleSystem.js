import Unit from '../entities/Unit.js';

// Animation class for attack movements
class AttackAnimation {
    constructor(attacker, target, onComplete) {
        this.attacker = attacker;
        this.target = target;
        this.onComplete = onComplete;

        this.startX = attacker.x;
        this.startY = attacker.y;
        this.progress = 0;
        this.duration = 400; // 400ms total
        this.phase = 'moving'; // 'moving' or 'returning'
    }

    update(deltaTime) {
        this.progress += deltaTime / this.duration;

        if (this.phase === 'moving') {
            if (this.progress >= 0.5) {
                // Halfway point - execute attack
                this.phase = 'returning';
                this.progress = 0;
                if (this.onComplete) this.onComplete();
            } else {
                // Move towards target (70% of the way)
                const t = this.progress * 2; // 0 to 1
                this.attacker.x = this.startX + (this.target.x - this.startX) * t * 0.7;
                this.attacker.y = this.startY + (this.target.y - this.startY) * t * 0.7;
            }
        } else {
            if (this.progress >= 1) {
                // Animation complete - restore position
                this.attacker.x = this.startX;
                this.attacker.y = this.startY;
                return true; // Animation finished
            } else {
                // Return to start
                const t = 1 - this.progress;
                this.attacker.x = this.startX + (this.target.x - this.startX) * t * 0.7;
                this.attacker.y = this.startY + (this.target.y - this.startY) * t * 0.7;
            }
        }
        return false; // Animation not finished
    }
}

export default class BattleSystem {
    constructor(game) {
        this.game = game;
        this.playerUnits = [];
        this.enemyUnits = [];
        this.waveIndex = 0;
        this.turnState = 'PLAYER_PHASE'; // PLAYER_PHASE, ENEMY_PHASE, VICTORY, DEFEAT
        this.actionQueue = []; // For handling simultaneous attacks/animations
        this.selectedUnit = null; // Unit selected to attack
        this.hoveredEnemy = null; // Enemy currently hovered (for future mouse support)
        this.animations = []; // Active animations
        this.bbMode = false; // BB mode activated
    }

    initTestBattle() {
        // Placeholder for testing without QuestSystem if needed
    }

    startWave(enemyDataArray) {
        console.log("BattleSystem.startWave called", enemyDataArray);
        this.enemyUnits = enemyDataArray.map((data, index) => {
            const unit = new Unit(data.name, false, data);
            unit.x = this.game.width * 0.6 + (index % 2) * 110;
            unit.y = this.game.height * 0.15 + Math.floor(index / 2) * 130;
            return unit;
        });

        // Setup Player Units
        if (this.playerUnits.length === 0) {
            this.playerUnits = this.game.partyManager.getParty().slice();
            console.log(`Équipe de combat chargée : ${this.playerUnits.length} unités`);
        } else {
            console.log(`Équipe de combat existante : ${this.playerUnits.length} unités`);
        }

        // Position Player Units
        this.playerUnits.forEach((unit, index) => {
            unit.x = this.game.width * 0.2 + (index % 2) * 110;
            unit.y = this.game.height * 0.45 + Math.floor(index / 2) * 130;
            console.log(`Positionnement joueur ${unit.name} à ${unit.x}, ${unit.y}`);
        });

        this.turnState = 'PLAYER_PHASE';
        this.game.uiManager.updateBattleInfo('Phase Joueur - Choisissez une unité');
        console.log("Vague commencée", this.enemyUnits);
    }

    update(deltaTime) {
        // Update animations
        this.animations = this.animations.filter(anim => !anim.update(deltaTime));

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

        // Check if clicking on a BB button first
        for (const unit of this.playerUnits) {
            if (!unit.hasActed && unit.isBbReady()) {
                const bbButtonX = unit.x + unit.width / 2 - 30;
                const bbButtonY = unit.y + unit.height + 5;
                const bbButtonWidth = 60;
                const bbButtonHeight = 25;

                if (x >= bbButtonX && x <= bbButtonX + bbButtonWidth &&
                    y >= bbButtonY && y <= bbButtonY + bbButtonHeight) {
                    console.log(`BB button clicked for ${unit.name}`);
                    this.executePlayerBB(unit);
                    return;
                }
            }
        }

        // If a unit is already selected, check if clicking on an enemy
        if (this.selectedUnit) {
            // Check if clicking on an enemy
            const clickedEnemy = this.enemyUnits.find(enemy =>
                x >= enemy.x && x <= enemy.x + enemy.width &&
                y >= enemy.y && y <= enemy.y + enemy.height
            );

            if (clickedEnemy) {
                console.log(`${this.selectedUnit.name} targeting ${clickedEnemy.name}`);
                this.executePlayerAttack(this.selectedUnit, clickedEnemy);
                this.selectedUnit = null;
                this.game.uiManager.updateBattleInfo('Phase Joueur - Choisissez une unité');
                return;
            }

            // If clicking elsewhere, deselect
            this.selectedUnit = null;
            this.game.uiManager.updateBattleInfo('Sélection annulée - Choisissez une unité');
        }

        // Check if a player unit was clicked
        this.playerUnits.forEach(unit => {
            if (!unit.hasActed &&
                x >= unit.x && x <= unit.x + unit.width &&
                y >= unit.y && y <= unit.y + unit.height) {

                this.selectedUnit = unit;
                console.log(`${unit.name} selected`);
                if (unit.isBbReady()) {
                    this.game.uiManager.updateBattleInfo(`${unit.name} - BB prêt ! Cliquez sur le bouton BB ou une cible`);
                } else {
                    this.game.uiManager.updateBattleInfo(`${unit.name} sélectionné - Choisissez une cible`);
                }
            }
        });
    }

    executePlayerAttack(unit, target) {
        // Check if BB is ready and used
        if (unit.isBbReady()) {
            this.executePlayerBB(unit);
            return;
        }

        // Normal Attack on selected target with animation
        if (target && !target.isDead()) {
            unit.hasActed = true;
            console.log(`${unit.name} attaque ${target.name} !`);

            // Create attack animation
            const animation = new AttackAnimation(unit, target, () => {
                // This callback is executed at the midpoint of the animation
                const damage = unit.attack(target);
                this.game.uiManager.showDamageNumber(target.x, target.y, damage);
                this.generateBattleCrystals(damage);
            });

            this.animations.push(animation);

            // Check turn end after animation completes
            setTimeout(() => this.checkTurnEnd(), 500);
        }
    }

    executePlayerBB(unit) {
        unit.hasActed = true;
        this.game.uiManager.showBattleMessage(`${unit.name} utilise son BB !`);

        // BB hits all enemies
        const damageTotal = unit.executeBB(this.enemyUnits);

        // Show damage on all enemies
        this.enemyUnits.forEach(enemy => {
            this.game.uiManager.showDamageNumber(enemy.x, enemy.y, "BB!", "gold");
        });

        this.checkTurnEnd();
    }

    generateBattleCrystals(damage) {
        // Simple logic: 1 BC per hit (or based on damage)
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
        this.game.uiManager.updateBattleInfo('Phase Joueur - Choisissez une unité');
    }

    handleWaveClear() {
        this.turnState = 'VICTORY';
        console.log("Vague terminée !");

        // Award XP to surviving players
        const xpPerEnemy = 50;
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

        // Draw selection indicator on selected unit
        if (this.selectedUnit) {
            ctx.strokeStyle = '#FFD700'; // Gold
            ctx.lineWidth = 4;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(
                this.selectedUnit.x - 5,
                this.selectedUnit.y - 5,
                this.selectedUnit.width + 10,
                this.selectedUnit.height + 10
            );
            ctx.setLineDash([]); // Reset dash

            // Draw targeting indicators on enemies (only if not in BB mode)
            if (!this.bbMode) {
                this.enemyUnits.forEach(enemy => {
                    if (!enemy.isDead()) {
                        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(
                            enemy.x - 2,
                            enemy.y - 2,
                            enemy.width + 4,
                            enemy.height + 4
                        );
                    }
                });
            }
        }

        // Draw BB mode indicator
        if (this.bbMode && this.selectedUnit) {
            // Golden overlay
            ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
            ctx.fillRect(0, 0, this.game.width, this.game.height);

            // BB text
            ctx.fillStyle = 'gold';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText('BRAVE BURST!', this.game.width / 2, 80);
            ctx.fillText('BRAVE BURST!', this.game.width / 2, 80);

            // Instruction text
            ctx.font = '24px Arial';
            ctx.strokeText('Cliquez pour lancer', this.game.width / 2, 120);
            ctx.fillText('Cliquez pour lancer', this.game.width / 2, 120);
        }

        // Draw BB buttons under player units
        this.playerUnits.forEach(unit => {
            if (!unit.hasActed && unit.isBbReady()) {
                const bbButtonX = unit.x + unit.width / 2 - 30;
                const bbButtonY = unit.y + unit.height + 5;
                const bbButtonWidth = 60;
                const bbButtonHeight = 25;

                // Button background with gradient
                const gradient = ctx.createLinearGradient(bbButtonX, bbButtonY, bbButtonX, bbButtonY + bbButtonHeight);
                gradient.addColorStop(0, '#ffd700');
                gradient.addColorStop(1, '#ff8c00');
                ctx.fillStyle = gradient;
                ctx.fillRect(bbButtonX, bbButtonY, bbButtonWidth, bbButtonHeight);

                // Button border
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.strokeRect(bbButtonX, bbButtonY, bbButtonWidth, bbButtonHeight);

                // Button text
                ctx.fillStyle = '#000';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('BB', bbButtonX + bbButtonWidth / 2, bbButtonY + bbButtonHeight / 2);

                // Glow effect
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 10;
                ctx.strokeRect(bbButtonX, bbButtonY, bbButtonWidth, bbButtonHeight);
                ctx.shadowBlur = 0;
            }
        });
    }
}
