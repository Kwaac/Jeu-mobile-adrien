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
        console.log("BattleSystem initialized", game);
        if (!game.endBattle) console.error("CRITICAL: game.endBattle is missing in BattleSystem!");
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
        this.setupTimer = 15; // Setup phase timer (seconds)
        this.selectedForSwap = null; // Unit selected for swapping position

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

                // Robust HP Reset
                let maxHp = unit.getStat('maxHp');
                if (!maxHp || maxHp <= 0) {
                    console.warn(`[BattleSystem] Unit ${unit.name} has invalid MaxHP (${maxHp}). Fallback to 100.`);
                    maxHp = unit.maxHp || 100;
                }
                unit.hp = maxHp;

                unit.soulPower = 0;
                unit.actionGauge = 0;
            });
            console.log(`Équipe de combat chargée : ${this.playerUnits.length} unités (État réinitialisé + HP Full)`);
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

        this.turnState = 'SETUP';
        this.setupTimer = 15;
        this.selectedForSwap = null;

        this.game.uiManager.updateBattleInfo('Préparez-vous...');
        this.game.uiManager.showStartBattleControls(true); // Show button
        console.log("Vague commencée - Phase SETUP", this.enemyUnits);
    }

    update(deltaTime) {
        // Update animations
        this.animations = this.animations.filter(anim => !anim.update(deltaTime));

        // SETUP PHASE Logic
        if (this.turnState === 'SETUP') {
            this.setupTimer -= deltaTime / 1000;
            if (this.setupTimer <= 0) {
                this.startCombat();
            } else {
                // Update UI Timer visually
                this.game.uiManager.updateSetupTimer(Math.ceil(this.setupTimer));
            }
            return; // Skip ATB updates during Setup
        }

        // Update all units (animations, etc.)
        [...this.playerUnits, ...this.enemyUnits].forEach(unit => {
            // unit.update(deltaTime); // If Unit has update method
        });

        // ATB LOGIC
        if (this.turnState !== 'VICTORY' && this.turnState !== 'DEFEAT' && this.turnState !== 'SETUP') {
            // ALWAYS Tick ATB (Real-Time)
            this.updateATB(deltaTime);

            // Sync UI
            this.game.uiManager.updateBattleUI();
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

        if (this.playerUnits.length === 0) {
            console.warn("CHECK_HP: playerUnits is empty!");
        }

        const allDead = this.playerUnits.every(u => {
            if (u.isDead()) {
                console.log(`CHECK_HP: Unit ${u.name} is DEAD (HP: ${u.hp})`);
                return true;
            }
            console.log(`CHECK_HP: Unit ${u.name} is ALIVE (HP: ${u.hp})`);
            return false;
        });

        if (allDead && this.turnState !== 'DEFEAT') {
            console.log("CHECK_HP: Defeat Condition Met. Units:", this.playerUnits);
            this.handleDefeat();
        }
    }

    updateATB(deltaTime) {
        // Auto-Battle: Game does NOT pause. Units act immediately.

        const allUnits = [...this.playerUnits, ...this.enemyUnits];

        for (const unit of allUnits) {
            if (unit.isBusy) continue; // Skip acting units

            const wasReady = unit.actionGauge >= 100;
            unit.tick(deltaTime);
            const isReady = unit.actionGauge >= 100;

            if (isReady && !wasReady) {
                // Unit JUST filled the bar
                unit.updateCooldowns();

                if (!unit.isPlayer) {
                    unit.isBusy = true;
                    this.handleEnemyTurnATB(unit);
                } else {
                    // Player Unit - AUTO TURN
                    this.executeAutoTurn(unit);
                }
            }
        }
    }

    executeAutoTurn(unit) {
        // Select Target (Front-line logic)
        const target = this.getAutoTarget(unit);
        if (!target) {
            this.turnComplete(unit);
            return;
        }

        unit.isBusy = true;

        // Determine Action
        // Priority: Queued Skill > Basic Attack
        // For now, always Basic Attack unless we add Queue logic later.

        console.log(`[Auto] ${unit.name} attacks ${target.name}`);
        this.executePlayerAttack(unit, target);
    }

    turnComplete(unit) {
        if (unit) {
            unit.resetActionGauge();
            unit.isBusy = false; // Unlock unit logic

            if (this.activeUnit === unit) {
                this.activeUnit = null;
                this.game.uiManager.updateBattleInfo('...');
            }
        }
    }

    startCombat() {
        if (this.turnState !== 'SETUP') return;

        console.log("Combat démarré !");
        this.turnState = 'PLAYER_PHASE';
        this.selectedForSwap = null;
        this.setupTimer = 0;

        this.game.uiManager.showStartBattleControls(false); // Hide button
        this.game.uiManager.updateBattleInfo('Phase Joueur - Choisissez une unité');
    }

    handleInput(x, y) {
        console.log(`handleInput called at (${x}, ${y}), TurnState: ${this.turnState}`);
        // SETUP PHASE: Positioning
        if (this.turnState === 'SETUP') {
            // Find clicked player unit
            const clickedUnit = this.playerUnits.find(u => {
                const hit = x >= u.x && x <= u.x + u.width &&
                    y >= u.y && y <= u.y + u.height;
                if (hit) console.log("Hit unit:", u.name, "at", u.x, u.y);
                return hit;
            });

            if (clickedUnit) {
                if (!this.selectedForSwap) {
                    // Select first unit
                    this.selectedForSwap = clickedUnit;
                    this.game.uiManager.showFloatingText(clickedUnit.x, clickedUnit.y, "Sélect.", "yellow");
                } else {
                    if (this.selectedForSwap === clickedUnit) {
                        // Deselect
                        this.selectedForSwap = null;
                        this.game.uiManager.showFloatingText(clickedUnit.x, clickedUnit.y, "Annulé", "white");
                    } else {
                        // Swap positions in Formation Grid
                        const idx1 = this.playerFormation.positions.indexOf(this.selectedForSwap);
                        const idx2 = this.playerFormation.positions.indexOf(clickedUnit);

                        if (idx1 !== -1 && idx2 !== -1) {
                            // Swap in array
                            this.playerFormation.positions[idx1] = clickedUnit;
                            this.playerFormation.positions[idx2] = this.selectedForSwap;

                            // Update coordinates visually
                            this.updateUnitPositions();

                            // Clear selection
                            this.game.uiManager.showFloatingText(clickedUnit.x, clickedUnit.y, "Échangé!", "#00ff00");
                            this.game.uiManager.showFloatingText(this.selectedForSwap.x, this.selectedForSwap.y, "Échangé!", "#00ff00");
                            this.selectedForSwap = null;
                        }
                    }
                }
            } else if (this.selectedForSwap) {
                // Determine if we clicked an empty slot
                const playerBaseX = this.game.width * 0.15;
                const playerBaseY = this.game.height * 0.20;
                const spY = 150;
                const spX = 100;
                const stagger = 40;

                for (let i = 0; i < 6; i++) {
                    const coords = this.playerFormation.getPositionCoordinates(i, playerBaseX + spX, playerBaseY, -spX, spY, stagger);
                    // Check bounds (assuming 100x100 unit size)
                    if (x >= coords.x && x <= coords.x + 100 &&
                        y >= coords.y && y <= coords.y + 100) {

                        // Check if slot is empty (it should be, otherwise clickedUnit would have caught it)
                        // Actually clickedUnit check iterates current units. If unit is at that pos, it catches.
                        // So if we are here, there is NO unit at this visual pos.

                        // Move command
                        const currentIdx = this.playerFormation.positions.indexOf(this.selectedForSwap);
                        if (currentIdx !== -1) {
                            // Remove from old
                            this.playerFormation.positions[currentIdx] = null;
                            // Place in new
                            this.playerFormation.positions[i] = this.selectedForSwap;

                            this.updateUnitPositions();
                            this.game.uiManager.showFloatingText(coords.x, coords.y, "Déplacé!", "#00ff00");
                            this.selectedForSwap = null;
                        }
                        return; // Found slot
                    }
                }
                // Clicked void logic (deselect if click outside?)
                this.selectedForSwap = null;
                console.log("Deselected (Clicked void)");
            }
        }

        // ATB: Only allow input if active unit is a player unit
        // With Auto-Battle, manual input is restricted to Soul Power (handled via UI portraits)
        // or Target Selection (optional optimization).
        // For now, removing old Button Menu click detection.

        // 1. Check if clicking on an enemy (Target Switching? future feature)

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
            const anim = new AttackAnimation(unit, target, () => {
                let dmg = unit.getStat('atk') * (skill.power || 1.2);
                target.takeDamage(Math.floor(dmg));
                this.game.uiManager.showDamageNumber(target.x, target.y, Math.floor(dmg));

                unit.putSkillOnCooldown(skillIndex);
                this.setActionMode('attack');
                this.turnComplete(unit);
            });
            this.animations.push(anim);
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

        if (mode === 'attack') {
            this.game.uiManager.updateBattleInfo("Choisissez une cible !");
        } else if (mode.startsWith('skill')) {
            this.game.uiManager.updateBattleInfo("Choisissez une cible !");
        }
    }

    executePlayerAttack(unit, target) {
        if (!unit || !target) return;

        console.log(`${unit.name} attaque ${target.name}`);
        console.log(`${unit.name} attaque ${target.name}`);
        const anim = new AttackAnimation(unit, target, () => {
            const damage = unit.attack(target);
            this.game.uiManager.showDamageNumber(target.x, target.y, damage);
            unit.fillSoulPower(10);
            this.turnComplete(unit);
        });
        this.animations.push(anim);
    }

    triggerSoulPower(unit) {
        if (!unit || unit.isDead() || !unit.isSoulPowerReady()) {
            console.log("Soul Power not ready or unit invalid");
            return;
        }

        this.game.uiManager.showBattleMessage(`${unit.name} : SOUL POWER !`);
        unit.executeUltimate(this.enemyUnits);

        // Ensure UI updates
        this.game.uiManager.updateBattleUI();
    }

    generateBattleCrystals(damage) {
        const bcCount = Math.max(1, Math.floor(damage / 5));
        for (let i = 0; i < bcCount; i++) {
            const receiver = this.playerUnits[Math.floor(Math.random() * this.playerUnits.length)];
            if (!receiver.isDead()) {
                receiver.fillSoulPower(5);
            }
        }
    }

    handleEnemyTurnATB(enemy) {
        console.log(`[AI] ${enemy.name} is thinking...`);

        // Simple Attack logic for enemy
        const target = this.playerUnits[Math.floor(Math.random() * this.playerUnits.length)];

        if (target) {
            console.log(`[AI] ${enemy.name} attacks ${target.name}`);
            const anim = new AttackAnimation(enemy, target, () => {
                const damage = enemy.attack(target);
                this.game.uiManager.showDamageNumber(target.x, target.y, damage, "red");
                this.turnComplete(enemy);
            });
            this.animations.push(anim);
        } else {
            this.turnComplete(enemy);
        }
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

    getAutoTarget(attacker) {
        // Determine attacker's row (0=Top, 1=Mid, 2=Bot)
        // Formation Indices: 0,1,2 (Front: Top, Mid, Bot), 3,4,5 (Back: Top, Mid, Bot) -> For BOTH teams?
        // Let's assume standard grid: 
        // 0 = Top, 1 = Mid, 2 = Bot (Front)
        // 3 = Top, 4 = Mid, 5 = Bot (Back)
        // Row = index % 3.

        let attackerRow = -1;
        if (attacker.isPlayer) {
            const idx = this.playerFormation.positions.indexOf(attacker);
            if (idx !== -1) attackerRow = idx % 3;
        } else {
            const idx = this.enemyFormation.positions.indexOf(attacker);
            if (idx !== -1) attackerRow = idx % 3;
        }

        // Filter valid targets
        const targets = attacker.isPlayer ? this.enemyUnits : this.playerUnits;
        const livingTargets = targets.filter(t => !t.isDead());

        if (livingTargets.length === 0) return null;

        // 1. Same Row Preference
        if (attackerRow !== -1) {
            const sameRowTarget = livingTargets.find(t => {
                const idx = attacker.isPlayer ? this.enemyFormation.positions.indexOf(t) : this.playerFormation.positions.indexOf(t);
                return (idx % 3) === attackerRow;
            });

            // Should also check Front Line protection? 
            // If SameRowTarget is BackLine but FrontLine exists in that row...
            // `canTargetPosition` check handles logic.
            if (sameRowTarget) {
                const formation = attacker.isPlayer ? this.enemyFormation : this.playerFormation;
                if (formation.canTargetPosition(sameRowTarget.position, attacker.class)) {
                    return sameRowTarget;
                }
            }
        }

        // 2. Fallback: First valid target (Front-line logic usually prioritizes indices 0,1,2)
        // We iterate livingTargets. Sort by 'Front Line First'?
        // The arrays positions logic usually keeps order.
        // Let's just pick the first valid one the Formation allows.
        const formation = attacker.isPlayer ? this.enemyFormation : this.playerFormation;

        for (const target of livingTargets) {
            if (formation.canTargetPosition(target.position, attacker.class)) {
                return target;
            }
        }

        return livingTargets[0]; // Absolute fallback
    }

    handleDefeat() {
        this.turnState = 'DEFEAT';
        console.log("handleDefeat called - Triggering endBattle");
        if (typeof this.game.endBattle === 'function') {
            this.game.endBattle(false);
        } else {
            console.error("ERROR: endBattle is not a function!", this.game);
        }
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

        // SETUP PHASE: Draw Empty Slots indicators
        if (this.turnState === 'SETUP') {
            const playerBaseX = this.game.width * 0.15;
            const playerBaseY = this.game.height * 0.20;
            const spY = 150;
            const spX = 100;
            const stagger = 40;

            for (let i = 0; i < 6; i++) {
                // Player coords logic from updateUnitPositions
                const coords = this.playerFormation.getPositionCoordinates(i, playerBaseX + spX, playerBaseY, -spX, spY, stagger);

                // Draw dashed box
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(coords.x, coords.y, 100, 100); // 100 is default unit width

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
            // Draw BB mode indicator -> REMOVED (Replaced by Portrait Click)


            // Draw Skill Buttons if Active Player Unit -> REMOVED for New Auto-Battle UI
            // New UI is DOM-based in UIManager
        }
    }

    /**
     * Met à jour les positions visuelles des unités selon leur formation
     */
    updateUnitPositions() {
        // Player Base (Left)
        // Shift setup: Back line is left of Front line? 
        // Logic: Col 0 = Front, Col 1 = Back in FormationGrid?
        // Wait, standard RPG: Front is closer to center.
        // If Player Base X is left side:
        // Front (Col 0) should be X + something?
        // Actually FormationGrid logic: x = baseX + (col * spacingX)
        // If col 0 is Front, and col 1 is Back.
        // Visuals: Player Front should be RIGHT of Player Back.
        // So for Player: SpacingX should be POSITIVE? No, if baseX is left-most.
        // Let's assume BaseX is roughly 15% width.
        // We want Back (Col 1) @ 15%. Front (Col 0) @ 15% + 100?
        // Or BaseX is the *Center* of formation?
        // Let's stick to simple: Base = Front line X. Back = Base - Spacing.
        // But Grid says: col = floor(pos/3). 0=Front, 1=Back.
        // So default Math: X = Base + 0 or Base + Spacing.
        // For Player: Front is RIGHT of Back. So Base should be Back, and +Spacing is Front?
        // Or Base is Front, and -Spacing is Back?
        // Let's maintain 'Left-to-Right' screen coords.
        // Player: Back (Left) -> Front (Right) -> CENTER <- Front (Left) <- Back (Right) : Enemy

        // Let's refine calculation for visual "Quinconce" and alignment.

        const playerBaseX = this.game.width * 0.15; // Left side
        const playerBaseY = this.game.height * 0.20; // Lower slightly to center vertically

        const enemyBaseX = this.game.width * 0.85; // Right side (shifted further right for skill menu space)
        const enemyBaseY = this.game.height * 0.20;

        const spY = 150; // Increased vertical spacing (Names don't overlap)
        const spX = 100; // Horizontal depth
        const stagger = 40; // Indentation for middle row

        // Position player units
        // We want Player Front (Col 0 in Grid logic usually? No, let's check Grid logic)
        // Grid: 0-2 Front, 3-5 Back. 
        // col calculation: pos/3 -> 0 for Front, 1 for Back.
        // So Front has col=0, Back has col=1.
        // Visual Player: Back should be Left (lower X), Front Right (higher X).
        // So we want Col 0 (Front) to have Higher X than Col 1 (Back)?
        // Original logic: x = baseX + (col * spacingX). 
        // If spacingX is positive, Back (1) is to the right of Front (0). That's wrong for Player if 0 is Front.
        // REVERSE logic for Player X?
        // Actually let's just interpret defaults:
        // Position 0 is Front-Top.
        // If I want Player Front-Top to be ahead (Right), I should treat it differently or adjust BaseX.
        // Let's use: Player BaseX = Start of Back Line?
        // If Player BaseX = 15%. Back line at 15%. Front line at 15% + 100.
        // But Grid returns (col * spacing). Col 0 is Front.
        // So Front = Base. Back = Base + Spacing?
        // If I want Back to be Left of Front:
        // Player: Col 0 (Front) should be at Base + 100. Col 1 (Back) at Base.
        // I can just pass spacingX = -100 ? 
        // If spacingX = -100: X = Base + (0) = Base. X = Base - 100. (Front is Right of Back).
        // Wait Col 0 is Front. So Front @ Base. Back @ Base - 100.
        // This puts Back to the Left. Correct.

        // Stagger: Middle row (1) slightly forward (Right) for Player? (+40)

        this.playerFormation.positions.forEach((unit, pos) => {
            if (unit) {
                // Player: Base is Front Line X. Spacing negative to put Back line to the left.
                // Stagger positive to push middle row Right (Aggressive).
                const coords = this.playerFormation.getPositionCoordinates(pos, playerBaseX + spX, playerBaseY, -spX, spY, stagger);
                unit.x = coords.x;
                unit.y = coords.y;
            }
        });

        // Position enemy units
        // Enemy: Back (Right) -> Front (Left)
        // BaseX = Front Line (Leftmost of Enemy side).
        // Col 0 (Front) @ Base. Col 1 (Back) @ Base + Spacing (Right).
        // So Spacing positive.
        // Stagger: Middle row slightly forward (Left) for Enemy? (-40).

        this.enemyFormation.positions.forEach((unit, pos) => {
            if (unit) {
                const coords = this.enemyFormation.getPositionCoordinates(pos, enemyBaseX, enemyBaseY, spX, spY, -stagger);
                unit.x = coords.x;
                unit.y = coords.y;
            }
        });
    }
}
