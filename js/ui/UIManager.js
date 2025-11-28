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
            <button id="btn-battle">Combat</button>
            <button id="btn-equip">Équipement</button>
            <button id="btn-shop">Boutique</button>
        `;
        mainMenu.style.display = 'none';
        this.uiLayer.appendChild(mainMenu);

        // Create Equipment Screen - NOUVELLE VERSION COMPLÈTE
        const equipScreen = document.createElement('div');
        equipScreen.id = this.screens.EQUIPMENT;
        equipScreen.className = 'screen equipment-screen';
        equipScreen.innerHTML = `
            <div class="equipment-container">
                <div class="character-list">
                    <div class="party-section">
                        <h3>⚔️ Équipe de Combat</h3>
                        <div id="party-list" class="unit-list"></div>
                    </div>
                    <hr class="separator">
                    <div class="owned-section">
                        <h3>📦 Personnages Possédés</h3>
                        <div id="owned-list" class="unit-list"></div>
                    </div>
                </div>
                <div class="character-detail">
                    <div id="no-selection" class="no-selection">
                        <p>👈 Sélectionnez un personnage</p>
                    </div>
                    <div id="character-info" class="character-info" style="display: none;">
                        <div class="character-display">
                            <div class="character-sprite" id="char-sprite"></div>
                            <div class="character-header">
                                <h2 id="char-name">-</h2>
                                <div class="character-meta">
                                    <span id="char-element" class="element-badge">-</span>
                                    <span id="char-rarity" class="rarity-badge">-</span>
                                </div>
                                <p id="char-description" class="description">-</p>
                            </div>
                        </div>
                        <div class="character-stats">
                            <h3>📊 Statistiques</h3>
                            <div id="stats-display" class="stats-grid"></div>
                        </div>
                        <div class="character-equipment">
                            <h3>🎒 Équipement</h3>
                            <div class="equipment-slots">
                                <div class="equipment-slot" data-slot="weapon">
                                    <span class="slot-label">⚔️ Arme :</span>
                                    <div id="slot-weapon" class="slot-content">Vide</div>
                                    <button class="btn-unequip" data-slot="weapon" style="display: none;">✖</button>
                                </div>
                                <div class="equipment-slot" data-slot="armor">
                                    <span class="slot-label">🛡️ Armure :</span>
                                    <div id="slot-armor" class="slot-content">Vide</div>
                                    <button class="btn-unequip" data-slot="armor" style="display: none;">✖</button>
                                </div>
                                <div class="equipment-slot" data-slot="accessory">
                                    <span class="slot-label">💍 Accessoire :</span>
                                    <div id="slot-accessory" class="slot-content">Vide</div>
                                    <button class="btn-unequip" data-slot="accessory" style="display: none;">✖</button>
                                </div>
                            </div>
                        </div>
                        <div class="inventory-section">
                            <h3>🎁 Inventaire</h3>
                            <div id="inventory-items" class="inventory-grid"></div>
                        </div>
                        <div class="party-actions">
                            <button id="btn-toggle-party" class="btn-party-toggle">Ajouter à l'équipe</button>
                        </div>
                    </div>
                </div>
            </div>
            <button id="btn-back-equip" class="btn-back">← Retour</button>
        `;
        equipScreen.style.display = 'none';
        this.uiLayer.appendChild(equipScreen);

        // Create Battle HUD
        const battleHud = document.createElement('div');
        battleHud.id = this.screens.BATTLE_HUD;
        battleHud.className = 'screen';
        battleHud.innerHTML = `
            <div id="battle-info">Début du combat !</div>
            <button id="btn-flee">Fuir</button>
        `;
        battleHud.style.display = 'none';
        this.uiLayer.appendChild(battleHud);

        // Create Shop Screen
        const shopScreen = document.createElement('div');
        shopScreen.id = this.screens.SHOP;
        shopScreen.className = 'screen';
        shopScreen.innerHTML = `
            <h2>Boutique</h2>
            <div style="display: flex; gap: 20px;">
                <div style="border: 1px solid white; padding: 10px;">
                    <h3>Boutique de Gemmes (Argent Réel)</h3>
                    <button id="btn-buy-gems-1">Acheter 1 Gemme (0,99€)</button>
                    <button id="btn-buy-gems-10">Acheter 10 Gemmes (8,99€)</button>
                </div>
                <div style="border: 1px solid white; padding: 10px;">
                    <h3>Portail d'Invocation</h3>
                    <button id="btn-summon">Invoquer une Unité (5 Gemmes)</button>
                </div>
            </div>
            <button id="btn-back-shop">Retour</button>
        `;
        shopScreen.style.display = 'none';
        this.uiLayer.appendChild(shopScreen);

        // Create Quest Selection Screen
        const questScreen = document.createElement('div');
        questScreen.id = this.screens.QUEST_SELECT;
        questScreen.className = 'screen';
        questScreen.innerHTML = `
            <h2>Sélectionner une Quête</h2>
            <div id="quest-list" style="overflow-y: auto; max-height: 60%; width: 80%; background: rgba(255,255,255,0.1); padding: 10px;"></div>
            <button id="btn-back-quest">Retour</button>
        `;
        questScreen.style.display = 'none';
        this.uiLayer.appendChild(questScreen);

        this.bindEvents();
    }

    updateEquipmentScreen() {
        this.updateCharacterList();
        // Select first unit in party by default if none selected
        const party = this.game.partyManager.getParty();
        if (party.length > 0 && !this.game.partyManager.getSelectedUnit()) {
            this.selectCharacter(party[0]);
        }
    }

    updateCharacterList() {
        const partyList = document.getElementById('party-list');
        const ownedList = document.getElementById('owned-list');

        if (!partyList || !ownedList) return;

        partyList.innerHTML = '';
        ownedList.innerHTML = '';

        const party = this.game.partyManager.getParty();
        const notInParty = this.game.partyManager.getUnitsNotInParty();
        const selected = this.game.partyManager.getSelectedUnit();

        party.forEach(unit => {
            const card = this.createCharacterCard(unit, true, selected === unit);
            partyList.appendChild(card);
        });

        notInParty.forEach(unit => {
            const card = this.createCharacterCard(unit, false, selected === unit);
            ownedList.appendChild(card);
        });
    }

    createCharacterCard(unit, inParty, isSelected) {
        const card = document.createElement('div');
        card.className = 'character-card';
        if (inParty) card.classList.add('in-party');
        if (isSelected) card.classList.add('selected');

        card.innerHTML = `
            <div class="char-name">${unit.name}</div>
            <div class="char-element">${unit.element}</div>
        `;

        card.addEventListener('click', () => {
            this.selectCharacter(unit);
        });

        return card;
    }

    selectCharacter(unit) {
        this.game.partyManager.selectUnit(unit);

        document.getElementById('no-selection').style.display = 'none';
        document.getElementById('character-info').style.display = 'block';

        this.updateCharacterDetail(unit);
        this.updateCharacterList();
    }

    updateCharacterDetail(unit) {
        document.getElementById('char-name').textContent = unit.name;
        document.getElementById('char-element').textContent = unit.element.toUpperCase();
        document.getElementById('char-rarity').textContent = '⭐'.repeat(unit.rarity);
        document.getElementById('char-description').textContent = unit.description || 'Aucune description';

        const sprite = document.getElementById('char-sprite');
        const colors = {
            'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
            'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
        };
        sprite.style.backgroundColor = colors[unit.element] || colors['none'];

        this.updateStatsDisplay(unit);
        this.updateEquipmentSlots(unit);
        this.updateInventoryForEquip(unit);

        const btn = document.getElementById('btn-toggle-party');
        if (this.game.partyManager.isInParty(unit)) {
            btn.textContent = "Retirer de l'équipe";
            btn.onclick = () => {
                this.game.partyManager.removeFromParty(unit);
                this.updateCharacterList();
                this.updateCharacterDetail(unit);
            };
        } else {
            btn.textContent = "Ajouter à l'équipe";
            btn.onclick = () => {
                if (this.game.partyManager.addToParty(unit)) {
                    this.updateCharacterList();
                    this.updateCharacterDetail(unit);
                } else {
                    alert('Équipe complète ! (Maximum 5 unités)');
                }
            };
        }
    }

    updateStatsDisplay(unit) {
        const statsDisplay = document.getElementById('stats-display');
        const atkBonus = unit.getStat('atk') - unit.atk;
        const defBonus = unit.getStat('def') - unit.def;
        const maxHp = unit.getStat('maxHp');

        statsDisplay.innerHTML = `
            <div class="stat-row level-row">
                <span class="stat-label">⭐ Niveau :</span>
                <span class="stat-value">${unit.level}</span>
            </div>
            <div class="stat-row xp-row">
                <span class="stat-label">📊 XP :</span>
                <span class="stat-value">${unit.xp} / ${unit.xpToNextLevel}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">❤️ HP :</span>
                <span class="stat-value">${unit.hp} / ${maxHp}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">⚔️ ATK :</span>
                <span class="stat-value">${unit.atk}${atkBonus > 0 ? ' (+' + atkBonus + ')' : ''}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🛡️ DEF :</span>
                <span class="stat-value">${unit.def}${defBonus > 0 ? ' (+' + defBonus + ')' : ''}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">💫 BB :</span>
                <span class="stat-value">${unit.bbGauge} / ${unit.maxBbGauge}</span>
            </div>
        `;
    }

    updateEquipmentSlots(unit) {
        const equipment = unit.getEquipment();

        ['weapon', 'armor', 'accessory'].forEach(slot => {
            const slotEl = document.getElementById(`slot-${slot}`);
            const unequipBtn = document.querySelector(`.btn-unequip[data-slot="${slot}"]`);

            if (equipment[slot]) {
                const statsStr = this.getItemStatsString(equipment[slot]);
                slotEl.innerHTML = `
                    <div class="equipped-name">${equipment[slot].name}</div>
                    <div class="equipped-desc">${statsStr}</div>
                `;
                slotEl.classList.add('equipped');
                unequipBtn.style.display = 'inline-block';
                unequipBtn.onclick = () => {
                    const item = unit.unequipItem(slot);
                    if (item) {
                        this.game.economySystem.addItem(item);
                    }
                    this.updateCharacterDetail(unit);
                };
            } else {
                slotEl.textContent = 'Vide';
                slotEl.classList.remove('equipped');
                unequipBtn.style.display = 'none';
            }
        });
    }

    updateInventoryForEquip(unit) {
        const inventoryGrid = document.getElementById('inventory-items');
        inventoryGrid.innerHTML = '';

        const inventory = this.game.economySystem.inventory;

        if (inventory.length === 0) {
            inventoryGrid.innerHTML = "<p class='empty-message'>Aucun objet dans l'inventaire</p>";
            return;
        }

        inventory.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'inventory-item';
            const statsStr = this.getItemStatsString(item);
            itemCard.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-desc">${statsStr}</div>
                <div class="item-type">${item.slot}</div>
            `;

            itemCard.addEventListener('click', () => {
                if (unit.equipItem(item)) {
                    this.game.economySystem.removeItem(item);
                    this.updateCharacterDetail(unit);
                }
            });

            inventoryGrid.appendChild(itemCard);
        });
    }

    getItemStatsString(item) {
        if (!item || !item.stats) return '';
        const stats = [];
        if (item.stats.atk) stats.push(`ATK +${item.stats.atk}`);
        if (item.stats.def) stats.push(`DEF +${item.stats.def}`);
        if (item.stats.maxHp) stats.push(`HP +${item.stats.maxHp}`);
        return stats.join(', ');
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
                <button>Commencer (${quest.energyCost} Énergie)</button>
            `;

            el.querySelector('button').addEventListener('click', () => {
                this.game.startBattle();
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

        document.getElementById('btn-back-equip').addEventListener('click', () => {
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
            console.log('Purchased 1 Gem!');
        });

        document.getElementById('btn-buy-gems-10').addEventListener('click', () => {
            this.game.economySystem.buyGems(10);
            console.log('Purchased 10 Gems!');
        });

        document.getElementById('btn-summon').addEventListener('click', () => {
            if (this.game.economySystem.spendResource('gems', 5)) {
                console.log('Summoned a new Unit! (Placeholder)');
            } else {
                console.log('Not enough Gems!');
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
            this.updateEquipmentScreen();
        } else if (screenId === this.screens.QUEST_SELECT) {
            this.updateQuestList();
        }
    }

    updateBattleInfo(text) {
        const info = document.getElementById('battle-info');
        if (info) info.textContent = text;
    }

    showDamageNumber(x, y, amount, color = 'white') {
        const el = document.createElement('div');
        el.textContent = amount;
        el.style.position = 'absolute';
        el.style.left = `${x + 20}px`;
        el.style.top = `${y}px`;
        el.style.color = color;
        el.style.fontSize = '24px';
        el.style.fontWeight = 'bold';
        el.style.textShadow = '2px 2px 0 #000';
        el.style.pointerEvents = 'none';
        el.style.animation = 'floatUp 1s ease-out forwards';

        // Add keyframes if not exists
        if (!document.getElementById('anim-style')) {
            const style = document.createElement('style');
            style.id = 'anim-style';
            style.textContent = `
                @keyframes floatUp {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-50px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        this.uiLayer.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    showBattleMessage(text) {
        const el = document.createElement('div');
        el.textContent = text;
        el.style.position = 'absolute';
        el.style.top = '20%';
        el.style.width = '100%';
        el.style.textAlign = 'center';
        el.style.color = 'gold';
        el.style.fontSize = '30px';
        el.style.fontWeight = 'bold';
        el.style.textShadow = '0 0 10px black';
        el.style.pointerEvents = 'none';
        el.style.animation = 'fadeOut 2s forwards';

        // Add keyframes if not exists
        if (!document.getElementById('msg-anim-style')) {
            const style = document.createElement('style');
            style.id = 'msg-anim-style';
            style.textContent = `
                @keyframes fadeOut {
                    0% { opacity: 1; transform: scale(1); }
                    80% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 0; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }

        this.uiLayer.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }
}
