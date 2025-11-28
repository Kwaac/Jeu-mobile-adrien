export default class QuestSystem {
    constructor(game) {
        this.game = game;
        this.activeQuest = null;
        this.currentWave = 0;

        this.quests = [
            {
                id: 'quest1',
                name: 'Plaines de Mistral',
                description: 'Commencez votre aventure ici.',
                energyCost: 5,
                waves: [
                    [{ name: 'Slime', hp: 30, atk: 5, def: 1, exp: 10, zel: 20 }],
                    [{ name: 'Slime', hp: 30, atk: 5, def: 1, exp: 10, zel: 20 }, { name: 'Gobelin', hp: 45, atk: 8, def: 2, exp: 15, zel: 30 }],
                    [{ name: 'Roi Slime', hp: 100, atk: 12, def: 5, exp: 50, zel: 100 }] // Boss
                ],
                rewards: { exp: 100, zel: 500 }
            },
            {
                id: 'quest2',
                name: 'Tour de Morgan',
                description: 'Une tour remplie de monstres.',
                energyCost: 8,
                waves: [
                    [{ name: 'Gobelin', hp: 50, atk: 10, def: 3, exp: 20, zel: 40 }],
                    [{ name: 'Gobelin', hp: 50, atk: 10, def: 3, exp: 20, zel: 40 }, { name: 'Loup', hp: 60, atk: 15, def: 2, exp: 25, zel: 50 }],
                    [{ name: 'Orc', hp: 150, atk: 20, def: 8, exp: 80, zel: 200 }]
                ],
                rewards: { exp: 200, zel: 800 }
            }
        ];
    }

    startQuest(questId) {
        console.log(`QuestSystem.startQuest called with ${questId}`);
        const quest = this.quests.find(q => q.id === questId);
        if (quest) {
            this.activeQuest = quest;
            this.currentWave = 0;
            console.log(`Début de la quête : ${quest.name}`);
            this.game.battleSystem.startWave(this.activeQuest.waves[0]);
        } else {
            console.error(`Quête non trouvée : ${questId}`);
        }
    }

    nextWave() {
        if (!this.activeQuest) return;

        this.currentWave++;
        if (this.currentWave < this.activeQuest.waves.length) {
            console.log(`Début de la vague ${this.currentWave + 1}`);
            this.game.battleSystem.startWave(this.activeQuest.waves[this.currentWave]);
        } else {
            this.completeQuest();
        }
    }

    completeQuest() {
        console.log('Quête terminée !');
        this.game.economySystem.earnZel(this.activeQuest.rewards.zel);
        // Add EXP logic here later
        this.activeQuest = null;
        this.game.endBattle(true); // true = victory
    }
}
