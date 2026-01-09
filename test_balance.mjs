
import Unit from './js/entities/Unit.js'; // Adjust path if needed relative to script execution
import { UNIT_DATABASE, getStatsForRarity } from './js/data/UnitDatabase.js';

// Mock console to keep output clean? No, let's see minimal output.
const LOG_BATTLES = false;

function log(...args) {
    if (LOG_BATTLES) console.log(...args);
}

function createUnit(id) {
    const data = UNIT_DATABASE[id];
    if (!data) return null;
    // Create at max rarity for full potential test
    const stats = getStatsForRarity(id, data.maxRarity);
    // Fix level to 50 for fair test
    stats.level = 50;
    stats.atk = Math.floor(stats.atk * 1.5); // Simulate level 50 roughly
    stats.def = Math.floor(stats.def * 1.5);
    stats.hp = Math.floor(stats.hp * 1.5);

    return new Unit(stats.name, false, stats);
}

function createRandomTeam(size = 5) {
    const allIds = Object.keys(UNIT_DATABASE);
    const team = [];
    for (let i = 0; i < size; i++) {
        const id = allIds[Math.floor(Math.random() * allIds.length)];
        team.push(createUnit(id));
    }
    return team;
}

function runBattle(teamA, teamB) {
    let turn = 0;
    const maxTurns = 200; // prevent infinite

    // Simple ATB Simulation
    // We tick 100ms at a time
    const dt = 100;

    while (teamA.some(u => !u.isDead()) && teamB.some(u => !u.isDead()) && turn < maxTurns * 10) { // arbitrary limit
        const allUnits = [...teamA, ...teamB];

        // Tick everyone
        let actor = null;

        // Randomize order slightly for same-tick ties
        allUnits.sort(() => Math.random() - 0.5);

        for (const unit of allUnits) {
            if (unit.isDead()) continue;

            const isReady = unit.tick(dt);
            if (isReady && !actor) {
                actor = unit;
            }
        }

        if (actor) {
            actor.resetActionGauge();
            const enemies = teamA.includes(actor) ? teamB : teamA;
            const allies = teamA.includes(actor) ? teamA : teamB;
            const liveEnemies = enemies.filter(u => !u.isDead());

            if (liveEnemies.length > 0) {
                // Action Logic
                // 1. Ultimate?
                if (actor.isSoulPowerReady()) {
                    // log(`${actor.name} uses ULTIMATE!`);
                    actor.executeUltimate(liveEnemies);
                } else {
                    // 2. Attack random target
                    const target = liveEnemies[Math.floor(Math.random() * liveEnemies.length)];
                    actor.attack(target);
                    actor.fillSoulPower(10);
                }
            }

            // Cooldowns (simplified)
            actor.updateCooldowns();
        }

        if (actor) turn++; // Count actual turns taken
    }

    const teamAAlive = teamA.some(u => !u.isDead());
    const teamBAlive = teamB.some(u => !u.isDead());

    if (teamAAlive && !teamBAlive) return 'A';
    if (!teamAAlive && teamBAlive) return 'B';
    return 'Draw';
}

// MAIN SIMULATION
const BATTLES = 100;
const results = {
    'Tank': { wins: 0, picked: 0 },
    'Warrior': { wins: 0, picked: 0 },
    'Support': { wins: 0, picked: 0 },
    'Ranger': { wins: 0, picked: 0 },
    'Assassin': { wins: 0, picked: 0 },
    'Mage': { wins: 0, picked: 0 }
};

const elementResults = {
    'fire': { wins: 0, picked: 0 },
    'water': { wins: 0, picked: 0 },
    'earth': { wins: 0, picked: 0 },
    'thunder': { wins: 0, picked: 0 },
    'light': { wins: 0, picked: 0 },
    'dark': { wins: 0, picked: 0 }
};

console.log(`Simulating ${BATTLES} random battles...`);

for (let i = 0; i < BATTLES; i++) {
    const teamA = createRandomTeam(5);
    const teamB = createRandomTeam(5);

    // Track Picks
    [...teamA, ...teamB].forEach(u => {
        if (results[u.class]) results[u.class].picked++;
        if (elementResults[u.element]) elementResults[u.element].picked++;
    });

    const winner = runBattle(teamA, teamB);

    if (winner === 'A') {
        teamA.forEach(u => {
            if (results[u.class]) results[u.class].wins++;
            if (elementResults[u.element]) elementResults[u.element].wins++;
        });
    } else if (winner === 'B') {
        teamB.forEach(u => {
            if (results[u.class]) results[u.class].wins++;
            if (elementResults[u.element]) elementResults[u.element].wins++;
        });
    }

    if (i % 10 === 0) process.stdout.write('.');
}

console.log("\n\n=== BALANCE RESULTS ===");
console.log("Class Win Rates:");
Object.keys(results).forEach(role => {
    const r = results[role];
    const rate = r.picked > 0 ? ((r.wins / r.picked) * 100).toFixed(1) : 0;
    console.log(`${role.padEnd(10)}: ${rate}% (${r.wins}/${r.picked})`);
});

console.log("\nElement Win Rates:");
Object.keys(elementResults).forEach(elem => {
    const r = elementResults[elem];
    const rate = r.picked > 0 ? ((r.wins / r.picked) * 100).toFixed(1) : 0;
    console.log(`${elem.padEnd(10)}: ${rate}% (${r.wins}/${r.picked})`);
});
