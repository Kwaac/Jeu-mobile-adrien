export default class Unit {
    constructor(name, isPlayer, stats) {
        this.name = name;
        this.isPlayer = isPlayer;

        // Apply stats
        Object.assign(this, stats);

        // Ensure core stats exist
        this.hp = this.hp || 100;
        this.maxHp = this.hp;
        this.atk = this.atk || 10;
        this.def = this.def || 5;
        this.bbGauge = 0;
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
        this.rarity = this.rarity || 3;
        this.description = this.description || '';

        // Equipment system
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null
        };

        // Battle state
        this.hasActed = false;
        this.isDeadState = false;

        // Visual properties (placeholder)
        this.x = 0;
        this.y = 0;
        this.width = 100; // Increased from 50 for better visibility and easier clicking
        this.height = 100; // Increased from 50
        this.color = isPlayer ? '#3498db' : '#e74c3c';
    }

    getStat(statName) {
        let base = this[statName];
        if (base === undefined) return 0;

        let bonus = 0;
        for (const key in this.equipment) {
            const item = this.equipment[key];
            if (item && item.stats && item.stats[statName]) {
                bonus += item.stats[statName];
            }
        }
        return base + bonus;
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

    executeBB(targets) {
        // Basic BB: AOE Attack
        console.log(`${this.name} utilise son BRAVE BURST !`);
        this.bbGauge = 0;

        let totalDamage = 0;
        targets.forEach(target => {
            if (!target.isDead()) {
                // BB deals 150% damage for now
                const atk = this.getStat('atk') * 1.5;
                const targetDef = target.getStat('def');
                const damage = Math.max(1, Math.floor(atk - targetDef));
                target.takeDamage(damage);
                totalDamage += damage;
            }
        });
        return totalDamage;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Visual indicator for BB Ready
        if (this.isBbReady()) {
            ctx.strokeStyle = 'gold';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }

        // HP Bar
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y - 10, this.width, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 10, this.width * hpPercent, 5);

        // BB Gauge
        const bbPercent = this.bbGauge / this.maxBbGauge;
        ctx.fillStyle = 'grey';
        ctx.fillRect(this.x, this.y - 4, this.width, 3);
        ctx.fillStyle = '#3498db'; // Blue for BB
        if (this.isBbReady()) ctx.fillStyle = 'gold'; // Gold when full
        ctx.fillRect(this.x, this.y - 4, this.width * bbPercent, 3);
    }
}
