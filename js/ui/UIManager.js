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
            QUEST_SELECT: 'quest-screen',
            EVOLUTION: 'evolution-screen'
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
            <div class="menu-header">
                <h2 style="font-family: 'Poppins', sans-serif; font-size: 24px; margin: 0;">⚔️ Brave RPG</h2>
                <div class="resources-display">
                    <div class="resource-item">
                        <span class="resource-icon">💎</span>
                        <span id="gems-count">0</span>
                    </div>
                    <div class="resource-item">
                        <span class="resource-icon">🪙</span>
                        <span id="gold-count">0</span>
                    </div>
                    <div class="resource-item">
                        <span class="resource-icon">⚡</span>
                        <span id="energy-count">100</span>
                    </div>
                </div>
            </div>
            <h1>Brave RPG</h1>
            <div class="menu-cards">
                <div class="menu-card" id="card-battle">
                    <div class="menu-card-content">
                        <div class="menu-card-icon">⚔️</div>
                        <h3>Combat</h3>
                        <p>Partez en quête et affrontez vos ennemis</p>
                    </div>
                </div>
                <div class="menu-card" id="card-equip">
                    <div class="menu-card-content">
                        <div class="menu-card-icon">👥</div>
                        <h3>Équipement</h3>
                        <p>Gérez votre équipe et votre équipement</p>
                    </div>
                </div>
                <div class="menu-card" id="card-inventory">
                    <div class="menu-card-content">
                        <div class="menu-card-icon">🎒</div>
                        <h3>Inventaire</h3>
                        <p>Gérez vos objets et équipements</p>
                    </div>
                </div>
                <div class="menu-card" id="card-shop">
                    <div class="menu-card-content">
                        <div class="menu-card-icon">🏪</div>
                        <h3>Boutique</h3>
                        <p>Achetez des gemmes et invoquez des héros</p>
                    </div>
                </div>
            </div>
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
            <h2 style="font-family: 'Poppins', sans-serif; font-size: 36px; margin-bottom: 30px;">🏪 Boutique</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1000px; width: 90%;">
                <div class="shop-section">
                    <h3 style="font-family: 'Poppins', sans-serif; color: var(--gold-color); margin-bottom: 20px;">💎 Gemmes Premium</h3>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div class="shop-item">
                            <div class="shop-item-icon">💎</div>
                            <div class="shop-item-info">
                                <h4>Pack Starter</h4>
                                <p>1 Gemme</p>
                            </div>
                            <button id="btn-buy-gems-1" class="shop-buy-btn">0,99€</button>
                        </div>
                        <div class="shop-item featured">
                            <div class="best-value-badge">MEILLEURE OFFRE</div>
                            <div class="shop-item-icon">💎</div>
                            <div class="shop-item-info">
                                <h4>Pack Premium</h4>
                                <p>10 Gemmes</p>
                            </div>
                            <button id="btn-buy-gems-10" class="shop-buy-btn gold">8,99€</button>
                        </div>
                    </div>
                </div>
                <div class="shop-section">
                    <h3 style="font-family: 'Poppins', sans-serif; color: var(--gold-color); margin-bottom: 20px;">✨ Portail d'Invocation</h3>
                    <div class="summon-portal">
                        <div class="portal-glow"></div>
                        <div class="portal-content">
                            <div style="font-size: 64px; margin-bottom: 20px;">🌟</div>
                            <h4 style="font-family: 'Poppins', sans-serif; font-size: 20px; margin-bottom: 10px;">Invoquer un Héros</h4>
                            <p style="color: var(--text-secondary); margin-bottom: 20px;">Obtenez un nouveau personnage aléatoire !</p>
                            <button id="btn-summon" class="summon-btn">Invoquer (5 💎)</button>
                        </div>
                    </div>
                </div>
            </div>
            <button id="btn-back-shop" class="btn-back">← Retour</button>
        `;
        shopScreen.style.display = 'none';
        this.uiLayer.appendChild(shopScreen);

        // Create Inventory Screen
        const inventoryScreen = document.createElement('div');
        inventoryScreen.id = this.screens.INVENTORY;
        inventoryScreen.className = 'screen';
        inventoryScreen.innerHTML = `
            <div class="inventory-header">
                <h2>🎒 Inventaire</h2>
                <div class="gold-display">
                    <span class="resource-icon">🪙</span>
                    <span id="inventory-gold">0</span> Or
                </div>
            </div>
            <div class="inventory-container">
                <div class="inventory-tabs">
                    <button class="tab-btn active" data-tab="all">Tout</button>
                    <button class="tab-btn" data-tab="weapon">Armes</button>
                    <button class="tab-btn" data-tab="armor">Armures</button>
                    <button class="tab-btn" data-tab="accessory">Accessoires</button>
                </div>
                <div id="full-inventory-grid" class="inventory-grid-large">
                    <!-- Items will be injected here -->
                </div>
            </div>
            <button id="btn-back-inventory" class="btn-back">← Retour</button>
        `;
        inventoryScreen.style.display = 'none';
        this.uiLayer.appendChild(inventoryScreen);

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

        // Create Evolution Screen
        const evolutionScreen = document.createElement('div');
        evolutionScreen.id = this.screens.EVOLUTION;
        evolutionScreen.className = 'screen';
        evolutionScreen.innerHTML = `
            <h2>🌟 Évolution</h2>
            <div class="evolution-container">
                <div class="evolution-source">
                    <h3>Avant</h3>
                    <div id="evo-before" class="evolution-preview">
                        <p>Sélectionnez une unité</p>
                    </div>
                </div>
                <div class="evolution-arrow">→</div>
                <div class="evolution-result">
                    <h3>Après</h3>
                    <div id="evo-after" class="evolution-preview">
                        <p>---</p>
                    </div>
                </div>
            </div>
            <div class="evolution-requirements">
                <h3>Matériaux Requis</h3>
                <div id="evo-materials"></div>
                <div id="evo-cost" class="cost-display"></div>
            </div>
            <div class="evolution-actions">
                <button id="btn-evolve" class="btn-evolve" disabled>Évoluer</button>
                <button id="btn-back-evolution" class="btn-back">← Retour</button>
            </div>
        `;
        evolutionScreen.style.display = 'none';
        this.uiLayer.appendChild(evolutionScreen);

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

        // Check if evolution is possible
        const canEvolve = unit.canEvolve();
        const duplicates = this.game.evolutionSystem.findDuplicates(unit);
        const hasEnoughDuplicates = duplicates.length >= 2;
        const evolutionPossible = canEvolve && hasEnoughDuplicates;

        const evolutionBadge = evolutionPossible
            ? '<span class="evolution-badge">🌟 Évolution!</span>'
            : '';

        card.innerHTML = `
            <div class="char-name">${unit.name}</div>
            <div class="char-element">${unit.element} ${unit.getRarityStars()}</div>
            ${evolutionBadge}
        `;

        card.addEventListener('click', () => this.selectCharacter(unit));
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

        const evolutionButton = unit.canEvolve()
            ? `<button id="btn-evolve-unit" class="btn-evolve" style="margin-top: 16px; width: 100%;">🌟 Évoluer (${unit.getRarityStars()} → ${'★'.repeat(unit.currentRarity + 1)})</button>`
            : '';

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
                <span class="stat-label">🌟 Rang :</span>
                <span class="stat-value">${unit.getRarityStars()} / ${unit.getMaxRarityStars()}</span>
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
            ${evolutionButton}
        `;

        // Add event listener for evolution button if it exists
        if (unit.canEvolve()) {
            setTimeout(() => {
                const btn = document.getElementById('btn-evolve-unit');
                if (btn) {
                    btn.onclick = () => this.openEvolutionScreen(unit);
                }
            }, 0);
        }
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
                console.log(`Clic sur commencer la quête : ${quest.name}`);
                this.game.startBattle();
                this.game.questSystem.startQuest(quest.id);
            });

            list.appendChild(el);
        });
    }

    bindEvents() {
        // Main Menu Card Navigation
        document.getElementById('card-battle').addEventListener('click', () => {
            this.showScreen(this.screens.QUEST_SELECT);
        });

        document.getElementById('card-equip').addEventListener('click', () => {
            this.showScreen(this.screens.EQUIPMENT);
        });

        document.getElementById('card-shop').addEventListener('click', () => {
            this.showScreen(this.screens.SHOP);
        });

        document.getElementById('btn-back-equip').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });

        document.getElementById('btn-flee').addEventListener('click', () => {
            this.game.endBattle();
        });

        // Shop Events
        document.getElementById('btn-back-shop').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });

        document.getElementById('btn-buy-gems-1').addEventListener('click', () => {
            this.game.economySystem.buyGems(1);
            this.updateResourceDisplay();
            console.log('Purchased 1 Gem!');
        });

        document.getElementById('btn-buy-gems-10').addEventListener('click', () => {
            this.game.economySystem.buyGems(10);
            this.updateResourceDisplay();
            console.log('Purchased 10 Gems!');
        });

        document.getElementById('btn-summon').addEventListener('click', () => {
            if (this.game.economySystem.spendResource('gems', 5)) {
                this.updateResourceDisplay();
                console.log('Summoned a new Unit! (Placeholder)');
            } else {
                console.log('Not enough Gems!');
            }
        });


        // Inventory Events
        const backBtn = document.getElementById('btn-back-inventory');
        console.log('btn-back-inventory element:', backBtn);

        document.getElementById('card-inventory').addEventListener('click', () => {
            this.openInventoryScreen();
        });

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Back button clicked - returning to main menu');
                this.showScreen(this.screens.MAIN_MENU);
            });
        } else {
            console.error('btn-back-inventory not found!');
        }

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const type = e.target.dataset.tab;
                this.updateInventoryGrid(type);
            });
        });

        // Quest Events
        document.getElementById('btn-back-quest').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });

        // Evolution Events
        document.getElementById('btn-back-evolution').addEventListener('click', () => {
            this.showScreen(this.screens.EQUIPMENT);
        });

        document.getElementById('btn-evolve').addEventListener('click', () => {
            this.performEvolution();
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
        } else if (screenId === this.screens.MAIN_MENU) {
            this.updateResourceDisplay();
        }
    }

    updateResourceDisplay() {
        const gemsEl = document.getElementById('gems-count');
        const goldEl = document.getElementById('gold-count');
        const energyEl = document.getElementById('energy-count');

        if (gemsEl) gemsEl.textContent = this.game.economySystem.resources.gems || 0;
        if (goldEl) goldEl.textContent = this.game.economySystem.resources.gold || 0;
        if (energyEl) energyEl.textContent = this.game.economySystem.resources.energy || 100;
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

    // Evolution Methods
    openEvolutionScreen(unit) {
        this.selectedEvolutionUnit = unit;
        this.showScreen(this.screens.EVOLUTION);
        this.updateEvolutionScreen();
    }

    updateEvolutionScreen() {
        const unit = this.selectedEvolutionUnit;
        if (!unit) return;

        const beforeDiv = document.getElementById('evo-before');
        const afterDiv = document.getElementById('evo-after');
        const materialsDiv = document.getElementById('evo-materials');
        const costDiv = document.getElementById('evo-cost');
        const evolveBtn = document.getElementById('btn-evolve');

        // Display current unit stats
        beforeDiv.innerHTML = `
            <div class="unit-preview">
                <h4>${unit.name}</h4>
                <p class="rarity-stars">${unit.getRarityStars()}</p>
                <p>Niveau ${unit.level}</p>
                <div class="stats-preview">
                    <p>HP: ${unit.hp}</p>
                    <p>ATK: ${unit.atk}</p>
                    <p>DEF: ${unit.def}</p>
                </div>
            </div>
        `;

        // Check if evolution is possible
        const check = this.game.evolutionSystem.canPerformEvolution(unit);

        if (check.possible) {
            // Show preview of evolved stats
            const preview = this.game.evolutionSystem.getEvolutionPreview(unit);
            afterDiv.innerHTML = `
                <div class="unit-preview">
                    <h4>${unit.name}</h4>
                    <p class="rarity-stars">${'★'.repeat(preview.nextRarity)}</p>
                    <p>Niveau 1</p>
                    <div class="stats-preview">
                        <p>HP: ${preview.nextStats.hp} <span class="stat-increase">+${preview.nextStats.hp - preview.currentStats.hp}</span></p>
                        <p>ATK: ${preview.nextStats.atk} <span class="stat-increase">+${preview.nextStats.atk - preview.currentStats.atk}</span></p>
                        <p>DEF: ${preview.nextStats.def} <span class="stat-increase">+${preview.nextStats.def - preview.currentStats.def}</span></p>
                    </div>
                </div>
            `;

            // Show materials
            materialsDiv.innerHTML = `
                <p>✓ 2 Duplicatas disponibles</p>
            `;

            // Show cost
            costDiv.innerHTML = `
                <p>💰 Coût: ${check.cost.toLocaleString()} Or</p>
            `;

            // Enable button
            evolveBtn.disabled = false;
        } else {
            // Show why evolution is not possible
            afterDiv.innerHTML = `
                <div class="unit-preview">
                    <p>Évolution impossible</p>
                </div>
            `;

            materialsDiv.innerHTML = `
                <p class="error">✗ ${check.reason}</p>
            `;

            costDiv.innerHTML = '';
            evolveBtn.disabled = true;
        }
    }

    performEvolution() {
        const unit = this.selectedEvolutionUnit;
        if (!unit) return;

        const check = this.game.evolutionSystem.canPerformEvolution(unit);
        if (!check.possible) {
            alert(check.reason);
            return;
        }

        // Perform evolution
        const success = this.game.evolutionSystem.evolveUnit(unit, check.duplicates);

        if (success) {
            alert(`✨ ${unit.name} a évolué vers ${unit.getRarityStars()} !`);
            this.updateResourceDisplay();
            this.showScreen(this.screens.EQUIPMENT);
            this.updateEquipmentScreen();
        } else {
            alert('Échec de l\'évolution');
        }
    }

    openInventoryScreen() {
        this.showScreen(this.screens.INVENTORY);
        this.updateInventoryScreen();
    }

    updateInventoryScreen() {
        const gold = this.game.economySystem.resources.gold || 0;
        const goldDisplay = document.getElementById('inventory-gold');
        if (goldDisplay) {
            goldDisplay.textContent = gold.toLocaleString();
        }
        this.updateInventoryGrid('all');
    }

    updateInventoryGrid(filterType) {
        const grid = document.getElementById('full-inventory-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const inventory = this.game.economySystem.inventory;

        let filteredItems = inventory;
        if (filterType !== 'all') {
            filteredItems = inventory.filter(item => item.type === filterType);
        }

        if (filteredItems.length === 0) {
            grid.innerHTML = '<div class="empty-inventory">Aucun objet trouvé</div>';
            return;
        }

        filteredItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'inventory-item-large';

            let icon = '❓';
            if (item.type === 'weapon') icon = '⚔️';
            if (item.type === 'armor') icon = '🛡️';
            if (item.type === 'accessory') icon = '💍';

            itemCard.innerHTML = `
                <div class="item-icon-large">${icon}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-type">${item.type.toUpperCase()}</div>
                    <div class="item-stats">${this.getItemStatsString(item)}</div>
                    <div class="item-desc">${item.description}</div>
                </div>
            `;

            grid.appendChild(itemCard);
        });
    }
}
