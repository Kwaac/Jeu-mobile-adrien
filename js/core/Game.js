import InputHandler from './InputHandler.js';
import BattleSystem from '../systems/BattleSystem.js';
import EconomySystem from '../systems/EconomySystem.js';
import QuestSystem from '../systems/QuestSystem.js';
import LootManager from '../systems/LootManager.js';
import UIManager from '../ui/UIManager.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.lastTime = 0;
        this.state = 'MENU'; // MENU, BATTLE

        this.input = new InputHandler(this);
        this.economySystem = new EconomySystem(this); // Init economy first
        this.lootManager = new LootManager(this);
        this.questSystem = new QuestSystem(this);
        this.battleSystem = new BattleSystem(this);
        this.uiManager = new UIManager(this);

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    startBattle() {
        this.state = 'BATTLE';
        this.uiManager.showScreen(this.uiManager.screens.BATTLE_HUD);
        // this.battleSystem.initTestBattle(); // Removed, now controlled by QuestSystem
    }

    endBattle(victory = false) {
        this.state = 'MENU';
        if (victory) {
            // Show Victory Screen (to be implemented in UIManager)
            alert("Victory! Quest Complete.");
            this.lootManager.collectLoot();
        } else {
            alert("Defeat...");
            this.lootManager.clearLoot();
        }
        this.uiManager.showScreen(this.uiManager.screens.MAIN_MENU);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.imageSmoothingEnabled = false; // Pixel art style preference
    }

    start() {
        console.log('Game Loop Started');
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(deltaTime) {
        if (this.state === 'BATTLE') {
            this.battleSystem.update(deltaTime);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Background
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.state === 'BATTLE') {
            this.battleSystem.draw(this.ctx);
        }

        // Debug Info
        // this.ctx.fillStyle = 'white';
        // this.ctx.font = '16px Arial';
        // this.ctx.fillText(`State: ${this.state}`, 10, 20);
    }
}
