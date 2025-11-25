export default class Unit {
    constructor(name, isPlayer, stats) {
        this.name = name;

        // Visual properties (placeholder)
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
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

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

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
        ctx.fillRect(this.x, this.y - 4, this.width * bbPercent, 3);
    }
}
