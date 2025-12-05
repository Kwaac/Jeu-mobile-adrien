export default class Unit {
    constructor(name, isPlayer, stats) {
        this.instanceId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.name = name;
        this.isPlayer = isPlayer;

        // Apply stats
        Object.assign(this, stats);

        // Rank/Evolution system
        this.maxBbGauge = this.maxBbGauge || 100;

        // Progression system
        this.level = stats.level || 1;
        this.xp = stats.xp || 0;
        this.xpToNextLevel = this.calculateXpToNextLevel();

        // Store base stats for level scaling
        this.baseAtk = this.atk;
        this.baseDef = this.def;
        this.baseMaxHp = this.maxHp;

        // Unit properties
        this.element = this.element || 'none';
        this.rarity = this.currentRarity; // Alias for compatibility
        this.description = this.description || '';

        // Equipment system
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };

        // Team bonuses (set by PartyManager)
        this.teamBonuses = null;

        // Tactical positioning
        this.position = null; // 0-5 (null = not placed)
        this.class = stats.class || this.determineClass(); // Warrior, Tank, Mage, Support, Ranger, Assassin
        this.savedPosition = stats.savedPosition || null; // Position sauvegardée

        // Battle state
        this.hasActed = false;

        // Visual properties (placeholder)
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 100;
        this.color = isPlayer ? '#3498db' : '#e74c3c';

        // Skills System
        this.skills = stats.skills || []; // Array of skill objects
        this.cooldowns = [0, 0, 0]; // Cooldown trackers for the 3 skills
    }

    getStat(statName) {
        let base = this[statName];
        if (base === undefined) return 0;

        let bonus = 0;

        // Bonus d'équipement
        for (const key in this.equipment) {
            const item = this.equipment[key];
            if (item && item.stats && item.stats[statName]) {
                bonus += item.stats[statName];
            }
        }

        // Bonus d'équipe (pourcentage)
        if (this.teamBonuses && this.teamBonuses[statName]) {
            const teamBonus = (base + bonus) * this.teamBonuses[statName];
            bonus += teamBonus;
        }

        return Math.floor(base + bonus);
    }

    calculateXpToNextLevel() {
        // Formula: 100 * level^1.5
        return Math.floor(100 * Math.pow(this.level, 1.5));
    }

    gainXp(amount) {
        this.xp += amount;
        console.log(`${this.name} gagne ${amount} XP (${this.xp}/${this.xpToNextLevel})`);

        // Check for level up
        while (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.xp -= this.xpToNextLevel;
        this.level++;

        // Increase stats (10% per level)
        const atkIncrease = Math.ceil(this.baseAtk * 0.1);
        const defIncrease = Math.ceil(this.baseDef * 0.1);
        const hpIncrease = Math.ceil(this.baseMaxHp * 0.1);

        this.atk += atkIncrease;
        this.def += defIncrease;
        this.maxHp += hpIncrease;
        this.hp = this.maxHp; // Full heal on level up

        this.xpToNextLevel = this.calculateXpToNextLevel();

        console.log(`🎉 ${this.name} monte au niveau ${this.level} !`);
        console.log(`ATK +${atkIncrease}, DEF +${defIncrease}, HP +${hpIncrease}`);
    }

    attack(target) {
        const atk = this.getStat('atk');
        const targetDef = target.getStat('def');
        const damage = Math.max(1, atk - targetDef);
        target.takeDamage(damage);
        return damage;
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
    }

    isDead() {
        return this.hp <= 0;
    }

    fillBbGauge(amount) {
        if (this.isDead()) return;
        this.bbGauge = Math.min(this.maxBbGauge, this.bbGauge + amount);
    }

    /**
     * Updates the action gauge based on speed and delta time
     * @param {number} deltaTime - Time elapsed since last frame (in seconds)
     * @returns {boolean} - True if gauge reached 100%
     */
    tick(deltaTime) {
        if (this.isDead()) return false;

        // Base speed factor: 10 speed = 10% per second approx?
        // Let's tune this: Speed 100 should fill in ~2-3 seconds?
        // Formula: Gauge += Speed * Multiplier * DeltaTime

        // Let's say Speed 100 = 20 gauge/sec => 5 seconds to fill
        // Speed 50 = 10 gauge/sec => 10 seconds to fill
        // Water Bonus +3% => Speed 103 => 20.6 gauge/sec

        const speedMultiplier = 1.5; // FAST PACED!
        const effectiveSpeed = this.getStat('speed');

        // Increase gauge
        this.actionGauge += effectiveSpeed * speedMultiplier * deltaTime;

        // Cap at 100 (but maybe allow overflow for "fastest acts first" tiebreaker later?)
        // For now, simple cap checking in BattleSystem, here just accumulate

        return this.actionGauge >= 100;
    }

    resetActionGauge() {
        this.actionGauge = 0;
        this.hasActed = true; // Mark as acted for this "turn" cycle if needed, though ATB is continuous
    }

    /**
     * Updates cooldowns at the start of turn
     */
    updateCooldowns() {
        this.cooldowns = this.cooldowns.map(cd => Math.max(0, cd - 1));
    }

    getSkill(index) {
        if (index < 0 || index >= this.skills.length) return null;
        return this.skills[index];
    }

    canUseSkill(index) {
        const skill = this.getSkill(index);
        if (!skill) return false;
        return this.cooldowns[index] === 0;
    }

    putSkillOnCooldown(index) {
        const skill = this.getSkill(index);
        if (skill) {
            this.cooldowns[index] = skill.cooldown;
        }
    }

    isBbReady() {
        return this.bbGauge >= this.maxBbGauge;
    }

    equipItem(item) {
        if (!item || !item.slot) {
            console.log('Objet invalide');
            return false;
        }

        const slot = item.slot;
        if (!this.equipment.hasOwnProperty(slot)) {
            console.log(`Slot invalide : ${slot}`);
            return false;
        }

        // Déséquiper l'objet actuel si présent
        if (this.equipment[slot]) {
            console.log(`Déséquipement de ${this.equipment[slot].name}`);
        }

        this.equipment[slot] = item;
        console.log(`${this.name} équipe ${item.name}`);
        return true;
    }

    unequipItem(slot) {
        if (!this.equipment.hasOwnProperty(slot)) {
            console.log(`Slot invalide : ${slot}`);
            return null;
        }

        const item = this.equipment[slot];
        this.equipment[slot] = null;

        if (item) {
            console.log(`${this.name} déséquipe ${item.name}`);
        }

        return item;
    }

    getEquipment() {
        return this.equipment;
    }

    // Alias methods for compatibility with UIManager
    equip(item) {
        return this.equipItem(item);
    }

    unequip(slot) {
        return this.unequipItem(slot);
    }

    /**
     * Définit les bonus d'équipe pour cette unité
     * @param {Object} bonuses - Objet de bonus d'équipe
     */
    setTeamBonuses(bonuses) {
        this.teamBonuses = bonuses;
    }

    /**
     * Récupère les bonus d'équipe actuels
     * @returns {Object} Bonus d'équipe
     */
    getTeamBonuses() {
        return this.teamBonuses;
    }

    /**
     * Détermine la classe de l'unité (si non définie)
     * @returns {string}
     */
    determineClass() {
        // Par défaut, basé sur l'élément (temporaire)
        const classMap = {
            'earth': 'Tank',
            'fire': 'Warrior',
            'water': 'Support',
            'dark': 'Assassin',
            'thunder': 'Mage',
            'light': 'Support'
        };
        return classMap[this.element] || 'Warrior';
    }

    /**
     * Vérifie si l'unité est en Front Line
     * @returns {boolean}
     */
    isInFrontLine() {
        return this.position !== null && this.position >= 0 && this.position <= 2;
    }

    /**
     * Vérifie si l'unité est en Back Line
     * @returns {boolean}
     */
    isInBackLine() {
        return this.position !== null && this.position >= 3 && this.position <= 5;
    }

    /**
     * Obtient le nom de la position
     * @returns {string}
     */
    getPositionName() {
        if (this.position === null) return 'Not Placed';
        const names = [
            'Front-Top', 'Front-Mid', 'Front-Bot',
            'Back-Top', 'Back-Mid', 'Back-Bot'
        ];
        return names[this.position] || 'Unknown';
    }

    executeBB(targets) {
        // Basic BB: AOE Attack
        console.log(`${this.name} utilise son ULTIMATE BURST !`);
        this.bbGauge = 0;

        let totalDamage = 0;
        targets.forEach(target => {
            if (!target.isDead()) {
                // BB deals 150% damage base
                let bbMultiplier = 1.5;

                // Appliquer le bonus de BB damage de l'équipe
                if (this.teamBonuses && this.teamBonuses.bbDamage) {
                    bbMultiplier += this.teamBonuses.bbDamage;
                }

                const atk = this.getStat('atk') * bbMultiplier;
                const targetDef = target.getStat('def');
                const damage = Math.max(1, Math.floor(atk - targetDef));
                target.takeDamage(damage);
                totalDamage += damage;
            }
        });
        return totalDamage;
    }

    draw(ctx) {
        if (this.isDeadState) return;

        // Draw basic unit box
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Highlight Active Unit (Gold Glow)
        if (this.actionGauge >= 100) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 5, this.y - 5, this.width + 10, this.height + 40);
        } else {
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        // Draw Name
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 10);

        // Draw HP Bar
        const hpPercentage = this.hp / this.maxHp;
        const barHeight = 6;
        const barY = this.y + this.height + 5;

        ctx.fillStyle = '#c0392b';
        ctx.fillRect(this.x, barY, this.width, barHeight);

        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x, barY, this.width * hpPercentage, barHeight);

        // Draw Action Gauge (ATB) - Enhanced
        const gaugeHeight = 10;
        const gaugeY = barY + barHeight + 4; // Below HP bar

        // Background
        ctx.fillStyle = '#444';
        ctx.fillRect(this.x, gaugeY, this.width, gaugeHeight);

        // Foreground (filling)
        const gaugeWidth = (this.actionGauge / 100) * this.width;
        ctx.fillStyle = '#f1c40f'; // Bright Yellow
        ctx.fillRect(this.x, gaugeY, gaugeWidth, gaugeHeight);

        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, gaugeY, this.width, gaugeHeight);

        // Text Value
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(Math.floor(this.actionGauge) + "%", this.x + this.width / 2, gaugeY + 9);

        // Draw BB Meter (Blue line above HP or similar? Keeping original logic below/above)
        // Original code had BB gauge too. Let's add it back small if needed or stick to requested changes.
        // User asked for Initiative Bar visibility primarily.
    }

    // Evolution methods
    canEvolve() {
        return this.currentRarity < this.maxRarity;
    }

    getEvolutionCost() {
        // Import will be done at runtime
        const costs = {
            1: 1000,
            2: 2500,
            3: 5000,
            4: 10000,
            5: 20000,
            6: 35000,
            7: 50000
        };
        return costs[this.currentRarity] || 0;
    }

    getRarityStars() {
        return '★'.repeat(this.currentRarity);
    }

    getMaxRarityStars() {
        return '★'.repeat(this.maxRarity);
    }
}
