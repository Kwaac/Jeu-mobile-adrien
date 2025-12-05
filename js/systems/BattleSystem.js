import Unit from '../entities/Unit.js';
import FormationGrid from './FormationGrid.js';

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
        this.defeatedEnemies = []; // Track defeated enemies for XP calculation
        this.waveIndex = 0;
        this.turnState = 'PLAYER_PHASE'; // PLAYER_PHASE, ENEMY_PHASE, VICTORY, DEFEAT
        this.actionMode = 'attack'; // 'attack' or 'skill'
        this.actionQueue = []; // For handling simultaneous attacks/animations
        this.selectedUnit = null; // Unit selected to attack
        this.hoveredEnemy = null; // Enemy currently hovered (for future mouse support)
        this.animations = []; // Active animations
        this.bbMode = false; // BB mode activated

        // Tactical positioning
        this.playerFormation = new FormationGrid();
        this.enemyFormation = new FormationGrid();
    }

    initTestBattle() {
        // Placeholder for testing without QuestSystem if needed
    }

    reset() {
        console.log("BattleSystem reset");
        this.playerUnits = [];
        this.enemyUnits = [];
        this.defeatedEnemies = [];
        this.waveIndex = 0;
        this.turnState = 'PLAYER_PHASE';
        this.actionQueue = [];
        this.selectedUnit = null;
        this.hoveredEnemy = null;
        this.animations = [];
        this.bbMode = false;
    }

    startWave(enemyDataArray) {
        console.log("BattleSystem.startWave called", enemyDataArray);
        // Reset defeated enemies for new wave
        this.defeatedEnemies = [];

        // Reset formations
        this.playerFormation.reset();
        this.enemyFormation.reset();

        // Create enemy units
        this.enemyUnits = enemyDataArray.map((data, index) => {
            const unit = new Unit(data.name, false, data);
            return unit;
        });

        // Setup Player Units
        if (this.playerUnits.length === 0) {
            this.playerUnits = this.game.partyManager.getParty().slice();
            // Reset unit state for new battle
            this.playerUnits.forEach(unit => {
                unit.hasActed = false;
                unit.isDeadState = false;
                unit.bbGauge = 0;
            });
            console.log(`Équipe de combat chargée : ${this.playerUnits.length} unités (État réinitialisé)`);
        } else {
            console.log(`Équipe de combat existante : ${this.playerUnits.length} unités`);
        }

        // Place player units in formation
        this.playerUnits.forEach((unit, index) => {
            const position = unit.savedPosition !== null ? unit.savedPosition : index;
            this.playerFormation.placeUnit(unit, position);
        });

        // Place enemy units in formation (auto-placement)
        this.enemyUnits.forEach((unit, index) => {
            this.enemyFormation.placeUnit(unit, index);
        });

        // Position units visually based on formation
        this.updateUnitPositions();

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

        // ATB LOGIC
        if (this.turnState !== 'VICTORY' && this.turnState !== 'DEFEAT') {
            // ALWAYS Tick ATB (Real-Time)
            this.updateATB(deltaTime);
        }

        // Check for dead units and track defeated enemies
        const deadEnemies = this.enemyUnits.filter(u => u.isDead());
        if (deadEnemies.length > 0) {
            this.defeatedEnemies.push(...deadEnemies);
        }
        this.enemyUnits = this.enemyUnits.filter(u => !u.isDead());

        if (this.enemyUnits.length === 0 && this.turnState !== 'VICTORY') {
            this.handleWaveClear();
        }

        if (this.playerUnits.every(u => u.isDead()) && this.turnState !== 'DEFEAT') {
            this.handleDefeat();
        }
    }

    updateATB(deltaTime) {
        const allUnits = [...this.playerUnits, ...this.enemyUnits];

        for (const unit of allUnits) {
            const wasReady = unit.actionGauge >= 100;
            unit.tick(deltaTime);
            const isReady = unit.actionGauge >= 100;

            if (isReady && !wasReady) {
                // Unit JUST filled the bar
                unit.updateCooldowns();

                if (!unit.isPlayer) {
                    this.handleEnemyTurnATB(unit);
                } else {
                    // Player Unit
                    if (!this.activeUnit) {
                        this.activeUnit = unit;
                        this.setActionMode('attack');
                        this.game.uiManager.updateBattleInfo(`Tour de ${this.activeUnit.name} !`);
                    }
                    // If activeUnit is already set, this unit waits at 100%
                }
            }

            // Safety: If activeUnit becomes null (turn end) and we have a waiting ready player, pick it
            if (isReady && unit.isPlayer && !this.activeUnit) {
                this.activeUnit = unit;
                this.setActionMode('attack');
                this.game.uiManager.updateBattleInfo(`Tour de ${this.activeUnit.name} !`);
            }
        }
    }

    turnComplete(unit) {
        if (unit) {
            unit.resetActionGauge();
            if (this.activeUnit === unit) {
                this.activeUnit = null;
                this.game.uiManager.updateBattleInfo('...');
            }
        }
    }

    handleInput(x, y) {
        // ATB: Only allow input if active unit is a player unit
        if (!this.activeUnit || !this.activeUnit.isPlayer) return;

        const unit = this.activeUnit;
        const buttonSize = 50;
        const buttonGap = 20;
        const totalWidth = (buttonSize * 4) + (buttonGap * 3);
        const startX = (this.game.width - totalWidth) / 2;
        const startY = 480;

        // 0. Check Button Clicks
        // Attack Button
        if (x >= startX && x <= startX + buttonSize &&
            y >= startY && y <= startY + buttonSize) {
            this.setActionMode('attack');
            return;
        }

        // Skill Buttons
        for (let i = 0; i < unit.skills.length; i++) {
            const btnX = startX + (i + 1) * (buttonSize + buttonGap);
            if (x >= btnX && x <= btnX + buttonSize &&
                y >= startY && y <= startY + buttonSize) {

                if (unit.canUseSkill(i)) {
                    this.setActionMode(`skill_${i}`);
                } else {
                    this.game.uiManager.showFloatingText(btnX, startY, "COOLDOWN", "grey");
                }
                return;
            }
        }

        // 1. Check if clicking on an enemy
        const clickedEnemy = this.enemyUnits.find(enemy =>
            x >= enemy.x && x <= enemy.x + enemy.width &&
            y >= enemy.y && y <= enemy.y + enemy.height
        );

        if (clickedEnemy) {
            if (this.actionMode === 'attack') {
                const canTarget = this.enemyFormation.canTargetPosition(clickedEnemy.position, unit.class);
                if (!canTarget) {
                    this.game.uiManager.updateBattleInfo(`❌ Cible protégée par la Front Line !`);
                    return;
                }
                this.executePlayerAttack(unit, clickedEnemy);
            } else if (this.actionMode.startsWith('skill_')) {
                const skillIndex = parseInt(this.actionMode.split('_')[1]);
                this.executeCharacterSkill(unit, clickedEnemy, skillIndex);
            }
            return;
        }

        // 2. Check Allies (for Heal/Buff skills)
        if (this.actionMode.startsWith('skill_')) {
            const skillIndex = parseInt(this.actionMode.split('_')[1]);
            const skill = unit.getSkill(skillIndex);

            if (skill && (skill.type === 'heal' || skill.type === 'buff')) {
                const clickedAlly = this.playerUnits.find(ally =>
                    x >= ally.x && x <= ally.x + ally.width &&
                    y >= ally.y && y <= ally.y + ally.height
                );

                if (clickedAlly) {
                    this.executeCharacterSkill(unit, clickedAlly, skillIndex);
                    return;
                }
            }
        }
    }

    executeCharacterSkill(unit, target, skillIndex) {
        const skill = unit.getSkill(skillIndex);
        if (!skill) return;

        console.log(`${unit.name} uses ${skill.name} on ${target.name}`);
        this.game.uiManager.showBattleMessage(`${unit.name} lance ${skill.name} !`);
        this.game.uiManager.showFloatingText(unit.x, unit.y - 40, skill.name, "yellow");

        if (skill.type === 'damage') {
            new AttackAnimation(this.game.ctx, unit, target, () => {
                let dmg = unit.getStat('atk') * (skill.power || 1.2);
                target.takeDamage(Math.floor(dmg));
                this.game.uiManager.showDamageNumber(target.x, target.y, Math.floor(dmg));

                unit.putSkillOnCooldown(skillIndex);
                this.setActionMode('attack');
                this.turnComplete(unit);
            });
            return;
        } else if (skill.type === 'heal') {
            target.hp = Math.min(target.maxHp, target.hp + (skill.value || 50));
            this.game.uiManager.showDamageNumber(target.x, target.y, skill.value || 50, "green");
        } else if (skill.type === 'buff') {
            this.game.uiManager.showFloatingText(target.x, target.y, "BUFF!", "blue");
        }

        unit.putSkillOnCooldown(skillIndex);
        this.setActionMode('attack');
        this.turnComplete(unit);
    }

    setActionMode(mode) {
        this.actionMode = mode;
        console.log(`Battle Mode set to: ${mode.toUpperCase()}`);
    }

    executePlayerAttack(unit, target) {
        if (!unit || !target) return;

        console.log(`${unit.name} attaque ${target.name}`);
        new AttackAnimation(this.game.ctx, unit, target, () => {
            const damage = unit.attack(target);
            this.game.uiManager.showDamageNumber(target.x, target.y, damage);
            unit.fillBbGauge(10);
            this.turnComplete(unit);
        });
    }

    executePlayerBB(unit) {
        // Placeholder BB logic
        this.game.uiManager.showBattleMessage(`${unit.name} utilise son BB !`);
        unit.executeBB(this.enemyUnits);
        setTimeout(() => this.turnComplete(unit), 1000);
    }

    generateBattleCrystals(damage) {
        const bcCount = Math.max(1, Math.floor(damage / 5));
        for (let i = 0; i < bcCount; i++) {
            const receiver = this.playerUnits[Math.floor(Math.random() * this.playerUnits.length)];
            if (!receiver.isDead()) {
                receiver.fillBbGauge(5);
            }
        }
    }

    handleEnemyTurnATB(enemy) {
        console.log(`[AI] ${enemy.name} is thinking...`);

        setTimeout(() => {
            if (this.turnState === 'VICTORY' || this.turnState === 'DEFEAT' || enemy.isDead()) return;

            const target = this.playerUnits[Math.floor(Math.random() * this.playerUnits.length)];
            if (target && !target.isDead()) {
                const damage = enemy.attack(target);
                this.game.uiManager.showDamageNumber(target.x, target.y, damage, 'red');
                enemy.x -= 20;
                setTimeout(() => enemy.x += 20, 200);
            }
            this.turnComplete(enemy);
        }, 800);
    }

    handleWaveClear() {
        this.turnState = 'VICTORY';
        console.log("Vague terminée !");

        const totalXp = this.defeatedEnemies.reduce((sum, enemy) => sum + (enemy.exp || 0), 0);
        this.playerUnits.forEach(unit => {
            if (!unit.isDead()) unit.gainXp(totalXp);
        });

        setTimeout(() => {
            this.game.storySystem.nextWave();
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
            ctx.strokeText('ULTIMATE BURST!', this.game.width / 2, 80);
            ctx.fillText('ULTIMATE BURST!', this.game.width / 2, 80);

            // Instruction text
            ctx.font = '24px Arial';
            ctx.strokeText('Cliquez pour lancer', this.game.width / 2, 120);
            ctx.fillText('Cliquez pour lancer', this.game.width / 2, 120);
        }

        // Draw Skill Buttons if Active Player Unit
        if (this.activeUnit && this.activeUnit.isPlayer) {
            const unit = this.activeUnit;
            const buttonSize = 50;
            const buttonGap = 20;
            const totalWidth = (buttonSize * 4) + (buttonGap * 3); // Attack + 3 Skills

            // Fixed Position at Bottom Center
            const startX = (this.game.width - totalWidth) / 2;
            const startY = 480; // Fixed Y coordinate (assuming canvas is ~600)

            // Draw Background Panel for Actions
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(startX - 10, startY - 10, totalWidth + 20, buttonSize + 20);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(startX - 10, startY - 10, totalWidth + 20, buttonSize + 20);

            // 1. Attack Button (Basic)
            this.drawActionButton(ctx, startX, startY, buttonSize, "⚔️", "attack", 0);

            // 2. Skill Buttons (1, 2, 3)
            unit.skills.forEach((skill, index) => {
                const x = startX + (index + 1) * (buttonSize + buttonGap);
                const icon = this.getSkillIcon(skill.type);
                this.drawActionButton(ctx, x, startY, buttonSize, icon, `skill_${index}`, this.activeUnit.cooldowns[index]);
            });

            // Draw Helper Text
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("Choisissez une action", this.game.width / 2, startY - 20);

            // Draw Description Panel if a mode is selected
            if (this.actionMode) {
                let description = "";
                let name = "";

                if (this.actionMode === 'attack') {
                    name = "Attaque";
                    description = "Attaque normale. Génère des cristaux de combat.";
                } else if (this.actionMode.startsWith('skill_')) {
                    const index = parseInt(this.actionMode.split('_')[1]);
                    const skill = unit.getSkill(index);
                    if (skill) {
                        name = skill.name;
                        description = skill.description;
                        if (skill.cooldown > 0) description += ` (CD: ${skill.cooldown})`;
                    }
                }

                if (name) {
                    const panelY = startY - 80;
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(this.game.width / 2 - 200, panelY, 400, 50);
                    ctx.strokeStyle = '#f1c40f';
                    ctx.strokeRect(this.game.width / 2 - 200, panelY, 400, 50);

                    ctx.fillStyle = '#f1c40f';
                    ctx.font = 'bold 18px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(name, this.game.width / 2, panelY + 20);

                    ctx.fillStyle = '#fff';
                    ctx.font = '14px Arial';
                    ctx.fillText(description, this.game.width / 2, panelY + 40);
                }
            }
        }
    }

    getSkillIcon(type) {
        if (type === 'damage') return '💥';
        if (type === 'heal') return '💚';
        if (type === 'buff') return '🛡️';
        if (type === 'debuff') return '💀';
        return '✨';
    }

    drawActionButton(ctx, x, y, size, icon, mode, cooldown) {
        const isCooldown = cooldown > 0;

        ctx.fillStyle = isCooldown ? '#95a5a6' : '#ecf0f1'; // Grey if CD, White if Ready
        if (this.actionMode === mode) ctx.fillStyle = '#f1c40f'; // Yellow if Selected

        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);

        // Icon
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, x + size / 2, y + size / 2);

        // Cooldown Overlay
        if (isCooldown) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(x, y, size, size);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(cooldown, x + size / 2, y + size / 2);
        }
    }

    /**
     * Met à jour les positions visuelles des unités selon leur formation
     */
    updateUnitPositions() {
        const playerBaseX = this.game.width * 0.15;
        const playerBaseY = this.game.height * 0.25;
        const enemyBaseX = this.game.width * 0.55;
        const enemyBaseY = this.game.height * 0.15;
        const spacing = 110;

        // Position player units
        this.playerFormation.positions.forEach((unit, pos) => {
            if (unit) {
                const coords = this.playerFormation.getPositionCoordinates(pos, playerBaseX, playerBaseY, spacing);
                unit.x = coords.x;
                unit.y = coords.y;
                console.log(`${unit.name} (${unit.class}) positionné à ${unit.getPositionName()} (${unit.x}, ${unit.y})`);
            }
        });

        // Position enemy units
        this.enemyFormation.positions.forEach((unit, pos) => {
            if (unit) {
                const coords = this.enemyFormation.getPositionCoordinates(pos, enemyBaseX, enemyBaseY, spacing);
                unit.x = coords.x;
                unit.y = coords.y;
            }
        });
    }
}
