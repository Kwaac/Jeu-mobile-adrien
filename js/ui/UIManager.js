export default class UIManager {
    constructor(game) {
        this.game = game;
        this.uiLayer = document.getElementById('ui-layer');
        this.currentScreen = null;

        this.screens = {
            MAIN_MENU: 'main-menu',
            BATTLE_HUD: 'battle-hud',
            EQUIPMENT: 'equipment-screen',
            SHOP: 'shop-screen',
            QUEST_SELECT: 'quest-screen'
        };

        this.initScreens();
        this.showScreen(this.screens.MAIN_MENU);
    }

    initScreens() {
        // Clear existing content (except debug overlay)
        const debug = document.getElementById('debug-overlay');
        this.uiLayer.innerHTML = '';
        if (debug) this.uiLayer.appendChild(debug);

        // Create Main Menu
        const mainMenu = document.createElement('div');
        mainMenu.id = this.screens.MAIN_MENU;
        mainMenu.className = 'screen';
        mainMenu.innerHTML = `
            <h1>Brave RPG</h1>
            <button id="btn-battle">Battle</button>
            <button id="btn-equip">Equipment</button>
            <button id="btn-shop">Shop</button>
        `;
        mainMenu.style.display = 'none';
        this.uiLayer.appendChild(mainMenu);

        // Create Equipment Screen
        const equipScreen = document.createElement('div');
        equipScreen.id = this.screens.EQUIPMENT;
        equipScreen.className = 'screen';
        equipScreen.innerHTML = `
            <h2>Equipment</h2>
            <div id="equipment-list" style="overflow-y: auto; max-height: 60%; width: 80%; background: rgba(255,255,255,0.1); padding: 10px;"></div>
            <button id="btn-back-menu">Back</button>
        `;
        equipScreen.style.display = 'none';
        this.uiLayer.appendChild(equipScreen);

        // Create Battle HUD
        const battleHud = document.createElement('div');
        battleHud.id = this.screens.BATTLE_HUD;
        battleHud.className = 'screen';
        battleHud.innerHTML = `
            <div id="battle-info">Battle Start!</div>
            <button id="btn-flee">Flee</button>
        `;
        battleHud.style.display = 'none';
        this.uiLayer.appendChild(battleHud);

        // Create Shop Screen
        const shopScreen = document.createElement('div');
        shopScreen.id = this.screens.SHOP;
        shopScreen.className = 'screen';
        shopScreen.innerHTML = `
            <h2>Shop</h2>
            <div style="display: flex; gap: 20px;">
                <div style="border: 1px solid white; padding: 10px;">
                    <h3>Gems Shop (Real Money)</h3>
                    <button id="btn-buy-gems-1">Buy 1 Gem ($0.99)</button>
                    <button id="btn-buy-gems-10">Buy 10 Gems ($8.99)</button>
                </div>
                <div style="border: 1px solid white; padding: 10px;">
                    <h3>Summon Gate</h3>
                    <button id="btn-summon">Summon Unit (5 Gems)</button>
                </div>
            </div>
            <button id="btn-back-shop">Back</button>
        `;
        shopScreen.style.display = 'none';
        this.uiLayer.appendChild(shopScreen);

        // Create Quest Selection Screen
        const questScreen = document.createElement('div');
        questScreen.id = this.screens.QUEST_SELECT;
        questScreen.className = 'screen';
        questScreen.innerHTML = `
            <h2>Select Quest</h2>
            <div id="quest-list" style="overflow-y: auto; max-height: 60%; width: 80%; background: rgba(255,255,255,0.1); padding: 10px;"></div>
            <button id="btn-back-quest">Back</button>
        `;
        questScreen.style.display = 'none';
        this.uiLayer.appendChild(questScreen);

        this.bindEvents();
    }

    updateEquipmentList() {
        const list = document.getElementById('equipment-list');
        list.innerHTML = '';

        this.game.economySystem.inventory.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.style.padding = '10px';
            itemEl.style.borderBottom = '1px solid #eee';
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'space-between';

            itemEl.innerHTML = `
                <span>${item.name} (${item.type})</span>
                <button style="padding: 5px 10px; font-size: 12px;">Equip</button>
            `;

            itemEl.querySelector('button').addEventListener('click', () => {
                if (this.game.battleSystem.playerUnits.length > 0) {
                    this.game.battleSystem.playerUnits[0].equipment[item.slot] = item;
                    alert(`Equipped ${item.name} to ${this.game.battleSystem.playerUnits[0].name}`);
                }
            });

            list.appendChild(itemEl);
        });
    }

    updateQuestList() {
        const list = document.getElementById('quest-list');
        list.innerHTML = '';

        this.game.questSystem.quests.forEach(quest => {
            const el = document.createElement('div');
            el.style.padding = '15px';
            el.style.borderBottom = '1px solid #eee';
            el.style.display = 'flex';
            el.style.justifyContent = 'space-between';
            el.style.alignItems = 'center';

            el.innerHTML = `
                <div>
                    <h3>${quest.name}</h3>
                    <p>${quest.description}</p>
                </div>
                <button>Start (${quest.energyCost} Energy)</button>
            `;

            el.querySelector('button').addEventListener('click', () => {
                this.game.startBattle(); // Switch state
                this.game.questSystem.startQuest(quest.id);
            });

            list.appendChild(el);
        });
    }

    bindEvents() {
        document.getElementById('btn-battle').addEventListener('click', () => {
            this.showScreen(this.screens.QUEST_SELECT);
        });

        document.getElementById('btn-equip').addEventListener('click', () => {
            this.showScreen(this.screens.EQUIPMENT);
        });

        document.getElementById('btn-back-menu').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });

        document.getElementById('btn-flee').addEventListener('click', () => {
            this.game.endBattle();
        });

        // Shop Events
        document.getElementById('btn-shop').addEventListener('click', () => {
            this.showScreen(this.screens.SHOP);
        });

        document.getElementById('btn-back-shop').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });

        document.getElementById('btn-buy-gems-1').addEventListener('click', () => {
            this.game.economySystem.buyGems(1);
            alert('Purchased 1 Gem!');
        });

        document.getElementById('btn-buy-gems-10').addEventListener('click', () => {
            this.game.economySystem.buyGems(10);
            alert('Purchased 10 Gems!');
        });

        document.getElementById('btn-summon').addEventListener('click', () => {
            if (this.game.economySystem.spendResource('gems', 5)) {
                alert('Summoned a new Unit! (Placeholder)');
            } else {
                alert('Not enough Gems!');
            }
        });

        // Quest Events
        document.getElementById('btn-back-quest').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });
    }

    showScreen(screenId) {
        // Hide all screens
        Object.values(this.screens).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // Show requested screen
        const target = document.getElementById(screenId);
        if (target) target.style.display = 'flex';
        this.currentScreen = screenId;

        if (screenId === this.screens.EQUIPMENT) {
            this.updateEquipmentList();
        } else if (screenId === this.screens.QUEST_SELECT) {
            this.updateQuestList();
        }
    }
}
