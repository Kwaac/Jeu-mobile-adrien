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
            INVENTORY: 'inventory-screen',
            QUEST_SELECT: 'quest-screen',
            EVOLUTION: 'evolution-screen',
            GUILD: 'guild-screen',
            AUTH: 'auth-screen'
        };

        this.initScreens();

        // Show Auth Screen if not logged in, otherwise Main Menu
        if (this.game.onlineSystem && this.game.onlineSystem.isOnline) {
            this.showScreen(this.screens.MAIN_MENU);
        } else {
            this.showAuthScreen();
        }

        // Hide debug overlay after initialization
        const debugOverlay = document.getElementById('debug-overlay');
        if (debugOverlay) {
            debugOverlay.style.display = 'none';
        }
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
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <h2 style="font-family: 'Poppins', sans-serif; font-size: 24px; margin: 0;">🌳 The Dying World Tree</h2>
                    <button id="btn-logout" style="background: none; border: 1px solid rgba(255,255,255,0.3); color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;">Déconnexion</button>
                </div>
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
            <h1>The Dying World Tree</h1>
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
                        <h3>Équipe</h3>
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
                <div class="menu-card" id="card-guild">
                    <div class="menu-card-content">
                        <div class="menu-card-icon">🏰</div>
                        <h3>La Guilde</h3>
                        <p>Invocation, Forgeron et Échope</p>
                    </div>
                </div>
                <div class="menu-card" id="card-shop">
                    <div class="menu-card-content">
                        <div class="menu-card-icon">💎</div>
                        <h3>Boutique Premium</h3>
                        <p>Achetez des gemmes</p>
                    </div>
                </div>
            </div>
        `;
        mainMenu.style.display = 'none';
        this.uiLayer.appendChild(mainMenu);

        // Create Equipment Screen - NOUVELLE VERSION AVEC ÉQUIPE HORIZONTALE
        const equipScreen = document.createElement('div');
        equipScreen.id = this.screens.EQUIPMENT;
        equipScreen.className = 'screen equipment-screen';
        equipScreen.innerHTML = `
            <div class="inventory-header">
                <div class="header-top-row">
                    <div class="shop-exit-btn" id="btn-equip-exit">
                        <div class="door-icon">🚪</div>
                        <span>Sortie</span>
                    </div>
                    <h2>👥 Équipe</h2>
                    <div></div> <!-- Empty div for grid balance -->
                </div>
                <div class="header-bottom-row">
                    <div class="gold-display">
                        <span class="resource-icon">🪙</span>
                        <span id="equip-gold">0</span> Or
                    </div>
                </div>
            </div>
            <div class="inventory-rpg-container team-screen-container">
                <!-- Colonne Gauche : Équipe & Détails -->
                <div class="character-sheet-panel party-column">
                    <h3 style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                        ⚔️ Membres <span id="party-count" style="font-size: 0.8em; color: #aaa; float: right;">(0/5)</span>
                    </h3>
                    
                    <!-- Liste des membres de l'équipe -->
                    <div id="party-units" class="party-list-vertical"></div>
                    
                    <!-- Panneau de détails du héros sélectionné -->
                    <div id="hero-details-panel" class="hero-details-panel" style="display:none; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <div class="hero-preview-large">
                            <!-- Avatar et infos injectés via JS -->
                        </div>
                        <button id="btn-remove-party" class="btn-action-rpg" style="width: 100%; margin-top: 15px; background: #e74c3c;">Retirer de l'équipe</button>
                    </div>
                </div>
                
                <!-- Colonne Droite : Héros Disponibles -->
                <div class="inventory-grid-panel available-heroes-column">
                    <div class="inventory-header">
                        <h3>Héros Disponibles <span id="total-hero-count" style="font-size: 0.8em; color: #aaa;">(0/50)</span></h3>
                    </div>
                    <div id="equipment-grid" class="inventory-grid-rpg available-heroes-grid"></div>
                </div>
            </div>
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
            <div class="shop-header">
                <h2 style="font-family: 'Poppins', sans-serif; font-size: 36px; margin: 0;">🏪 Boutique</h2>
                <div class="shop-resources">
                    <div class="resource-pill">
                        <span class="resource-icon">💎</span>
                        <span id="shop-gems-amount">0</span>
                    </div>
                    <div class="resource-pill">
                        <span class="resource-icon">🪙</span>
                        <span id="shop-gold-amount">0</span>
                    </div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1000px; width: 90%; margin-top: 20px;">
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
                <div class="header-top-row">
                    <div class="shop-exit-btn" id="btn-inventory-exit">
                        <div class="door-icon">🚪</div>
                        <span>Sortie</span>
                    </div>
                    <h2>🎒 Inventaire</h2>
                    <div></div> <!-- Empty div for grid balance -->
                </div>
                <div class="header-bottom-row">
                    <div class="gold-display">
                        <span class="resource-icon">🪙</span>
                        <span id="inventory-gold">0</span> Or
                    </div>
                </div>
            </div>
            <div class="inventory-rpg-container">
                <!-- COLONNE GAUCHE : Fiche Perso -->
                <div class="character-sheet-panel">
                    <!-- Sélecteur de Héros -->
                    <div class="hero-selector-container">
                        <div id="hero-selector-list" class="hero-list"></div>
                    </div>

                    <!-- Zone Principale Personnage -->
                    <div class="character-display-area">
                        <h3 id="rpg-hero-name" class="rpg-hero-name">Sélectionnez un héros</h3>
                        
                        <div class="character-visual-container">
                            <!-- Slots d'équipement autour -->
                            <div class="equipment-slot slot-left" data-slot="weapon" id="rpg-slot-weapon" title="Arme">
                                <div class="slot-icon">⚔️</div>
                                <div class="slot-item-img"></div>
                                <button class="btn-unequip-rpg" style="display: none;">✖</button>
                            </div>
                            
                            <div class="character-avatar-large" id="rpg-hero-avatar"></div>
                            
                            <div class="equipment-slot slot-right" data-slot="armor" id="rpg-slot-armor" title="Armure">
                                <div class="slot-icon">🛡️</div>
                                <div class="slot-item-img"></div>
                                <button class="btn-unequip-rpg" style="display: none;">✖</button>
                            </div>

                            <div class="equipment-slot slot-bottom" data-slot="accessory" id="rpg-slot-accessory" title="Accessoire">
                                <div class="slot-icon">💍</div>
                                <div class="slot-item-img"></div>
                                <button class="btn-unequip-rpg" style="display: none;">✖</button>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="character-stats-rpg" id="rpg-hero-stats">
                            <!-- Rempli par JS -->
                        </div>
                    </div>
                </div>

                <!-- COLONNE DROITE : Inventaire -->
                <div class="inventory-grid-panel">
                    <div class="inventory-tabs">
                        <button class="tab-btn active" data-tab="all">Tout</button>
                        <button class="tab-btn" data-tab="weapon">Armes</button>
                        <button class="tab-btn" data-tab="armor">Armures</button>
                        <button class="tab-btn" data-tab="accessory">Accessoires</button>
                    </div>
                    <div id="rpg-inventory-grid" class="rpg-items-grid"></div>
                </div>
            </div>
        `;
        inventoryScreen.style.display = 'none';
        this.uiLayer.appendChild(inventoryScreen);

        // Attach inventory event listeners immediately after creation
        const invExitBtn = inventoryScreen.querySelector('#btn-inventory-exit');
        if (invExitBtn) {
            invExitBtn.addEventListener('click', () => {
                this.showScreen(this.screens.MAIN_MENU);
            });
        }

        inventoryScreen.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                inventoryScreen.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const type = e.target.dataset.tab;
                this.updateInventoryGrid(type);
            });
        });

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

        // Create Guild Screen
        const guildScreen = document.createElement('div');
        guildScreen.id = this.screens.GUILD;
        guildScreen.className = 'screen';
        guildScreen.innerHTML = `
            <div class="inventory-header">
                <div class="header-top-row">
                    <div class="shop-exit-btn" id="btn-guild-exit">
                        <div class="door-icon">🚪</div>
                        <span>Sortie</span>
                    </div>
                    <h2>🏰 La Guilde</h2>
                    <div></div> <!-- Empty div for grid balance -->
                </div>
                <div class="header-bottom-row">
                    <div class="guild-tabs">
                        <button class="guild-tab active" data-tab="summon">Invocation</button>
                        <button class="guild-tab" data-tab="blacksmith">Forgeron</button>
                        <button class="guild-tab" data-tab="shop">Échope</button>
                    </div>
                </div>
            </div>
            
            <div class="guild-content">
                <!-- Tab: Invocation -->
                <div id="tab-summon" class="guild-tab-content active">
                    <div class="summon-banner">
                        <h3>Portail Rare</h3>
                        <p>Invoquez des héros légendaires !</p>
                        <div class="banner-visual">🌟</div>
                    </div>
                    <div class="summon-actions">
                        <button id="btn-summon-single" class="btn-summon">
                            <span class="summon-label">Invocation Simple</span>
                            <span class="summon-cost">💎 5</span>
                        </button>
                        <button id="btn-summon-multi" class="btn-summon">
                            <span class="summon-label">Invocation x10</span>
                            <span class="summon-cost">💎 50</span>
                        </button>
                    </div>
                </div>

                <!-- Tab: Forgeron -->
                <div id="tab-blacksmith" class="guild-tab-content">
                    
                    <!-- Gold display -->
                    <div class="blacksmith-gold-display" id="blacksmith-gold">
                        💰 Or: <span id="blacksmith-gold-amount">0</span>
                    </div>
                    
                    <!-- Filter buttons -->
                    <div class="blacksmith-filters">
                        <button class="filter-btn active" data-filter="all">Tout</button>
                        <button class="filter-btn" data-filter="weapon">⚔️ Armes</button>
                        <button class="filter-btn" data-filter="armor">🛡️ Armures</button>
                        <button class="filter-btn" data-filter="accessory">💍 Accessoires</button>
                    </div>
                    
                    <div class="blacksmith-container">
                        <!-- Left: Item Grid -->
                        <div class="blacksmith-list-panel">
                            <h3>Équipements <span id="equipment-count">(0)</span></h3>
                            <div id="blacksmith-items" class="blacksmith-grid"></div>
                        </div>

                        <!-- Right: Upgrade Panel -->
                        <div class="blacksmith-upgrade-panel">
                            <div id="blacksmith-preview">
                                <p class="placeholder-text">Sélectionnez un équipement à améliorer</p>
                            </div>
                            <div id="blacksmith-materials" class="materials-section" style="display:none;">
                                <h4>Matériau requis (Doublon)</h4>
                                <div id="blacksmith-material-slot" class="material-slot"></div>
                            </div>
                            <div id="blacksmith-cost" class="cost-display"></div>
                            <button id="btn-upgrade" class="btn-upgrade" disabled>Améliorer</button>
                        </div>
                    </div>
                </div>

                <!-- Tab: Échope -->
                <div id="tab-shop" class="guild-tab-content">
                    <div class="shop-gold-display" id="shop-gold">
                        💰 Or: <span id="shop-gold-amount">0</span>
                    </div>
                    
                    <!-- Special Offers Section -->
                    <div class="special-offers-section">
                        <h3 style="text-align: center; margin: 0 0 10px 0; color: #f39c12;">
                            ⭐ Offres Spéciales <span id="special-timer" style="font-size: 0.7em; color: #95a5a6;"></span>
                        </h3>
                        <div class="special-offers-grid" id="special-offers">
                            <!-- Special items will be populated here -->
                        </div>
                    </div>
                    
                    <h3 style="text-align: center; margin: 15px 0 10px 0;">Votre Inventaire</h3>
                    <div class="shop-inventory-grid" id="shop-player-inventory">
                        <!-- Player inventory will be populated here -->
                    </div>
                    
                    <h3 style="text-align: center; margin: 15px 0 10px 0;">Équipements Disponibles</h3>
                    <div class="shop-grid" id="shop-items">
                        <!-- Items will be populated here -->
                    </div>
                </div>
            </div>
            
            <button id="btn-back-guild" class="btn-back">← Retour</button>

            <!-- Summon Animation Overlay -->
            <div id="summon-overlay" class="summon-overlay" style="display: none;">
                <div class="summon-crystal">💎</div>
                <div id="summon-result-card" class="summon-result-card" style="display: none;">
                    <!-- Result injected here -->
                </div>
                <button id="btn-close-summon" style="display: none;">Continuer</button>
            </div>
        `;
        guildScreen.style.display = 'none';
        this.uiLayer.appendChild(guildScreen);

        this.bindEvents();

        // Bind logout button
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    updateEquipmentScreen() {
        this.renderPartySlots();
        this.renderAvailableHeroes();

        // Update counts
        const party = this.game.partyManager.getParty();
        const allUnits = this.game.partyManager.getAllUnits();

        const partyCountEl = document.getElementById('party-count');
        if (partyCountEl) partyCountEl.textContent = `(${party.length}/5)`;

        const totalCountEl = document.getElementById('total-hero-count');
        if (totalCountEl) totalCountEl.textContent = `(${allUnits.length}/50)`;
    }

    renderPartySlots() {
        const partyContainer = document.getElementById('party-units');
        if (!partyContainer) return;

        partyContainer.innerHTML = '';
        const party = this.game.partyManager.getParty();
        const maxPartySize = 5;

        // Render 5 slots (filled or empty)
        for (let i = 0; i < maxPartySize; i++) {
            const unit = party[i];
            const slotEl = document.createElement('div');
            slotEl.className = 'party-unit-card-row';

            if (unit) {
                // Filled slot
                const colors = {
                    'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
                    'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
                };

                slotEl.innerHTML = `
                    <div class="unit-avatar" style="background-color: ${colors[unit.element] || colors['none']}"></div>
                    <div class="unit-info">
                        <div class="unit-name">${unit.name}</div>
                        <div class="unit-level">Niv. ${unit.level} - ${unit.getRarityStars()}</div>
                    </div>
                    <div class="unit-status">✅</div>
                `;

                slotEl.onclick = () => {
                    this.renderHeroDetails(unit);
                    // Update selection visual
                    document.querySelectorAll('.party-unit-card-row').forEach(el => el.classList.remove('selected'));
                    slotEl.classList.add('selected');
                };

                // Select first unit by default if none selected
                if (i === 0 && !document.querySelector('.party-unit-card-row.selected')) {
                    setTimeout(() => slotEl.click(), 0);
                }
            } else {
                // Empty slot
                slotEl.style.opacity = '0.5';
                slotEl.style.cursor = 'default';
                slotEl.innerHTML = `
                    <div class="unit-avatar" style="background: rgba(255,255,255,0.1); border-style: dashed;"></div>
                    <div class="unit-info">
                        <div class="unit-name" style="color: #aaa;">Emplacement vide</div>
                        <div class="unit-level">Ajoutez un héros</div>
                    </div>
                `;
            }

            partyContainer.appendChild(slotEl);
        }
    }

    renderHeroDetails(unit) {
        const detailsPanel = document.getElementById('hero-details-panel');
        if (!detailsPanel) return;

        detailsPanel.style.display = 'block';

        const colors = {
            'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
            'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
        };

        const previewContainer = detailsPanel.querySelector('.hero-preview-large');
        previewContainer.innerHTML = `
            <div class="hero-avatar-large" style="background-color: ${colors[unit.element] || colors['none']}"></div>
            <h3 style="margin: 0; color: #fff;">${unit.name}</h3>
            <div style="color: #ffd700; margin-bottom: 5px;">${unit.getRarityStars()}</div>
            <div style="color: #ffd700; margin-bottom: 5px;">${unit.getRarityStars()}</div>
            <div style="color: #aaa; font-size: 0.9em; margin-bottom: 5px;">Niveau ${unit.level}</div>
            
            <!-- XP Bar -->
            <div class="xp-container" style="width: 100%; height: 6px; background: #333; border-radius: 3px; margin-bottom: 15px; position: relative;">
                <div class="xp-bar" style="width: ${(unit.xp / unit.xpToNextLevel) * 100}%; height: 100%; background: #3498db; border-radius: 3px;"></div>
                <div style="position: absolute; top: -15px; right: 0; font-size: 0.7em; color: #aaa;">${unit.xp} / ${unit.xpToNextLevel} XP</div>
            </div>
            
            <div class="hero-stats-grid">
                <div class="stat-item">
                    <span style="color: #e74c3c;">HP</span>
                    <span class="stat-value">${unit.hp}/${unit.getStat('maxHp')}</span>
                </div>
                <div class="stat-item">
                    <span style="color: #3498db;">ATK</span>
                    <span class="stat-value">${unit.atk}</span>
                </div>
                <div class="stat-item">
                    <span style="color: #2ecc71;">DEF</span>
                    <span class="stat-value">${unit.def}</span>
                </div>
            </div>
            ${unit.canEvolve() ? `<button id="btn-evolve-unit-panel" class="btn-evolve" style="margin-top: 15px; width: 100%; padding: 10px; background: linear-gradient(to right, #f1c40f, #f39c12); border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer;">🌟 Évoluer</button>` : ''}
        `;

        if (unit.canEvolve()) {
            setTimeout(() => {
                const btn = document.getElementById('btn-evolve-unit-panel');
                if (btn) {
                    btn.onclick = () => this.openEvolutionScreen(unit);
                }
            }, 0);
        }

        const removeBtn = document.getElementById('btn-remove-party');
        if (removeBtn) {
            removeBtn.onclick = () => {
                this.game.partyManager.removeFromParty(unit);
                this.updateEquipmentScreen();
                detailsPanel.style.display = 'none';
            };
        }
    }

    renderAvailableHeroes() {
        const gridContainer = document.getElementById('equipment-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';
        const allUnits = this.game.partyManager.getAllUnits();
        const party = this.game.partyManager.getParty();

        // Filter out units already in party
        const availableUnits = allUnits.filter(u => !party.includes(u));

        if (availableUnits.length === 0) {
            gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #aaa; padding: 20px;">Aucun autre héros disponible</div>';
            return;
        }

        availableUnits.forEach(unit => {
            const unitCard = document.createElement('div');
            unitCard.className = 'hero-card-compact';

            const colors = {
                'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
                'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
            };

            unitCard.innerHTML = `
                <div class="hero-avatar" style="background-color: ${colors[unit.element] || colors['none']}"></div>
                <div class="hero-name">${unit.name}</div>
                <div class="hero-level">Niv. ${unit.level}</div>
            `;

            unitCard.onclick = () => {
                const result = this.game.partyManager.addToParty(unit);
                if (result === true) {
                    this.updateEquipmentScreen();
                } else if (result === 'PARTY_FULL') {
                    alert('Équipe complète ! (Maximum 5 unités)');
                } else if (result === 'DUPLICATE_NAME' || result === 'DUPLICATE_TYPE') {
                    alert('Vous ne pouvez pas avoir deux héros avec le même nom dans l\'équipe !');
                } else if (result === 'ALREADY_IN_PARTY') {
                    alert('Ce héros est déjà dans l\'équipe !');
                }
            };

            gridContainer.appendChild(unitCard);
        });
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
                unequipBtn.style.display = 'none';
            }
        });
    }

    updateInventoryForEquip(unit) {
        const inventoryGrid = document.getElementById('inventory-items');
        if (!inventoryGrid) return;
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
                <div class="item-type">${item.type}</div>
            `;

            itemCard.addEventListener('click', () => {
                if (unit.equip(item)) {
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

        document.getElementById('btn-equip-exit').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });

        document.getElementById('btn-flee').addEventListener('click', () => {
            this.game.endBattle();
        });

        // Shop Events
        document.getElementById('btn-back-shop').addEventListener('click', () => {
            this.showScreen(this.screens.MAIN_MENU);
        });

        document.getElementById('btn-back-evolution').addEventListener('click', () => {
            this.showScreen(this.screens.EQUIPMENT);
        });

        // Guild Events
        const cardGuild = document.getElementById('card-guild');
        if (cardGuild) {
            cardGuild.addEventListener('click', () => {
                this.openGuildScreen();
            });
        }

        const btnGuildExit = document.getElementById('btn-guild-exit');
        if (btnGuildExit) {
            btnGuildExit.addEventListener('click', () => {
                this.showScreen(this.screens.MAIN_MENU);
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateBlacksmithScreen(e.target.dataset.filter);
            });
        });

        document.querySelectorAll('.guild-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateGuildScreen(e.target.dataset.tab);
            });
        });

        const btnSummonSingle = document.getElementById('btn-summon-single');
        if (btnSummonSingle) {
            btnSummonSingle.addEventListener('click', () => {
                this.performSummon();
            });
        }

        const btnSummonMulti = document.getElementById('btn-summon-multi');
        if (btnSummonMulti) {
            btnSummonMulti.addEventListener('click', () => {
                this.performMultiSummon();
            });
        }

        const btnCloseSummon = document.getElementById('btn-close-summon');
        if (btnCloseSummon) {
            btnCloseSummon.addEventListener('click', () => {
                document.getElementById('summon-overlay').style.display = 'none';
            });
        }

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

        // Update shop screen resources
        const shopGemsEl = document.getElementById('shop-gems-amount');
        const shopGoldEl = document.getElementById('shop-gold-amount');
        if (shopGemsEl) shopGemsEl.textContent = this.game.economySystem.resources.gems || 0;
        if (shopGoldEl) shopGoldEl.textContent = this.game.economySystem.resources.gold || 0;

        // Update inventory screen gold
        const invGoldEl = document.getElementById('inventory-gold');
        if (invGoldEl) invGoldEl.textContent = this.game.economySystem.resources.gold || 0;

        // Update equipment screen gold
        const equipGoldEl = document.getElementById('equip-gold');
        if (equipGoldEl) equipGoldEl.textContent = this.game.economySystem.resources.gold || 0;
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
            // Force refresh of the unit display to show new stats and rank
            this.updateCharacterDetail(unit);
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

        // Render party units at the top
        this.renderInventoryPartyUnits();

        // Render items grid
        this.updateInventoryGrid('all');
    }

    renderInventoryPartyUnits() {
        const selectorList = document.getElementById('hero-selector-list');
        if (!selectorList) return;

        selectorList.innerHTML = '';
        const party = this.game.partyManager.getParty();

        if (party.length === 0) {
            selectorList.innerHTML = '<div class="empty-party">Vide</div>';
            return;
        }

        party.forEach(unit => {
            const avatar = document.createElement('div');
            avatar.className = 'hero-avatar-small';

            const colors = {
                'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
                'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
            };
            avatar.style.backgroundColor = colors[unit.element] || colors['none'];
            avatar.title = unit.name;

            if (this.selectedHeroForEquipment === unit) {
                avatar.classList.add('selected');
            }

            avatar.addEventListener('click', () => {
                this.selectHeroForEquipment(unit);
            });

            selectorList.appendChild(avatar);
        });

        // Select first hero by default if none selected
        if (!this.selectedHeroForEquipment && party.length > 0) {
            this.selectHeroForEquipment(party[0]);
        }
    }

    selectHeroForEquipment(unit) {
        this.selectedHeroForEquipment = unit;

        // Update visual selection in list
        document.querySelectorAll('.hero-avatar-small').forEach(av => {
            av.classList.remove('selected');
            if (av.title === unit.name) av.classList.add('selected'); // Simple check by name
        });

        // Update main display
        this.updateHeroEquipmentDisplay(unit);
        console.log(`Héros sélectionné: ${unit.name}`);
    }

    updateHeroEquipmentDisplay(unit) {
        // Update Name
        const nameEl = document.getElementById('rpg-hero-name');
        if (nameEl) nameEl.textContent = unit.name;

        // Update Large Avatar
        const avatarEl = document.getElementById('rpg-hero-avatar');
        if (avatarEl) {
            const colors = {
                'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
                'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
            };
            avatarEl.style.backgroundColor = colors[unit.element] || colors['none'];
        }

        // Update Slots
        const slots = ['weapon', 'armor', 'accessory'];
        slots.forEach(slot => {
            const slotEl = document.getElementById(`rpg-slot-${slot}`);
            if (!slotEl) return;

            const itemImg = slotEl.querySelector('.slot-item-img');
            const unequipBtn = slotEl.querySelector('.btn-unequip-rpg');
            const iconEl = slotEl.querySelector('.slot-icon');

            if (unit.equipment && unit.equipment[slot]) {
                const item = unit.equipment[slot];
                // Show item
                let icon = '❓';
                if (item.type === 'weapon') icon = '⚔️';
                if (item.type === 'armor') icon = '🛡️';
                if (item.type === 'accessory') icon = '💍';

                if (itemImg) {
                    itemImg.textContent = icon;
                    itemImg.style.display = 'flex';
                }
                if (iconEl) iconEl.style.opacity = '0'; // Hide default icon
                // Click on slot to unequip
                slotEl.style.cursor = 'pointer';
                slotEl.onclick = () => {
                    this.unequipItemFromHero(unit, slot);
                };
                slotEl.title = `${item.name} (Niv. ${item.level || 1}) - Cliquez pour déséquiper`;
                slotEl.classList.add('equipped');
            } else {
                // Empty slot
                if (itemImg) {
                    itemImg.textContent = '';
                    itemImg.style.display = 'none';
                }
                if (iconEl) iconEl.style.opacity = '0.3'; // Show default icon
                slotEl.style.cursor = 'default';
                slotEl.title = slot.charAt(0).toUpperCase() + slot.slice(1);
                slotEl.classList.remove('equipped');
            }
        });

        // Update Stats
        const statsEl = document.getElementById('rpg-hero-stats');
        if (statsEl) {
            const baseAtk = unit.atk;
            const baseDef = unit.def;
            const baseHp = unit.getStat('maxHp');

            const totalAtk = unit.getStat('atk');
            const totalDef = unit.getStat('def');
            const totalHp = unit.getStat('maxHp');

            const atkBonus = totalAtk - baseAtk;
            const defBonus = totalDef - baseDef;
            const hpBonus = totalHp - baseHp;

            statsEl.innerHTML = `
                <div class="rpg-stat-row">
                    <span class="rpg-stat-label">HP</span>
                    <span class="rpg-stat-value">${totalHp} ${hpBonus > 0 ? `<span class="rpg-stat-bonus">(+${hpBonus})</span>` : ''}</span>
                </div>
                <div class="rpg-stat-row">
                    <span class="rpg-stat-label">ATK</span>
                    <span class="rpg-stat-value">${totalAtk} ${atkBonus > 0 ? `<span class="rpg-stat-bonus">(+${atkBonus})</span>` : ''}</span>
                </div>
                <div class="rpg-stat-row">
                    <span class="rpg-stat-label">DEF</span>
                    <span class="rpg-stat-value">${totalDef} ${defBonus > 0 ? `<span class="rpg-stat-bonus">(+${defBonus})</span>` : ''}</span>
                </div>
            `;
        }
    }

    unequipItemFromHero(unit, slot) {
        if (!unit.equipment || !unit.equipment[slot]) return;

        const item = unit.equipment[slot];

        // Remove from unit
        unit.unequip(slot);

        // Add back to inventory
        this.game.economySystem.inventory.push(item);

        // Refresh displays
        this.updateHeroEquipmentDisplay(unit);

        // Get current filter tab
        const activeTab = document.querySelector('.tab-btn.active');
        const filterType = activeTab ? activeTab.dataset.tab : 'all';
        this.updateInventoryGrid(filterType);

        this.renderInventoryPartyUnits();
    }

    equipItemOnSelectedHero(item) {
        const unit = this.selectedHeroForEquipment;
        if (!unit) return;

        // Determine slot based on item type
        let slot = item.type;

        // Check if slot is already occupied
        if (unit.equipment && unit.equipment[slot]) {
            const oldItem = unit.equipment[slot];
            this.game.economySystem.inventory.push(oldItem);
        }

        // Equip the item
        unit.equip(item);

        // Remove from inventory
        const index = this.game.economySystem.inventory.indexOf(item);
        if (index > -1) {
            this.game.economySystem.inventory.splice(index, 1);
        }

        // Refresh displays
        this.updateHeroEquipmentDisplay(unit);

        // Get current filter tab
        const activeTab = document.querySelector('.tab-btn.active');
        const filterType = activeTab ? activeTab.dataset.tab : 'all';
        this.updateInventoryGrid(filterType);
        this.renderInventoryPartyUnits();
    }

    updateInventoryGrid(filterType) {
        const grid = document.getElementById('rpg-inventory-grid');
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
            itemCard.className = 'rpg-item-card';

            let icon = '❓';
            if (item.type === 'weapon') icon = '⚔️';
            if (item.type === 'armor') icon = '🛡️';
            if (item.type === 'accessory') icon = '💍';

            itemCard.innerHTML = `
                <div class="rpg-item-icon">${icon}</div>
                <div class="rpg-item-level">Niv.${item.level || 1}</div>
            `;

            // Add tooltip
            itemCard.title = `${item.name}\n${item.type.toUpperCase()}\n${this.getItemStatsString(item)}\n${item.description || ''}`;

            // Add click event to equip on selected hero
            itemCard.addEventListener('click', () => {
                if (this.selectedHeroForEquipment) {
                    this.equipItemOnSelectedHero(item);
                } else {
                    alert('Sélectionnez d\'abord un héros !');
                }
            });

            grid.appendChild(itemCard);
        });
    }
    openEvolutionScreen(unit) {
        this.selectedEvolutionUnit = unit;
        this.selectedMaterials = [];
        this.showScreen(this.screens.EVOLUTION);

        // Update Before/After
        const preview = this.game.evolutionSystem.getEvolutionPreview(unit);

        const beforeEl = document.getElementById('evo-before');
        beforeEl.innerHTML = `
            <div class="character-card">
                <div class="char-name">${unit.name}</div>
                <div class="char-element">${unit.element} ${unit.getRarityStars()}</div>
                <div class="char-stats">
                    HP: ${unit.maxHp}<br>
                    ATK: ${unit.atk}<br>
                    DEF: ${unit.def}
                </div>
            </div>
        `;

        const afterEl = document.getElementById('evo-after');
        if (preview) {
            afterEl.innerHTML = `
                <div class="character-card">
                    <div class="char-name">${unit.name}</div>
                    <div class="char-element">${unit.element} ${'⭐'.repeat(preview.nextRarity)}</div>
                    <div class="char-stats">
                        HP: <span class="stat-boost">${preview.nextStats.hp} (+${preview.nextStats.hp - unit.maxHp})</span><br>
                        ATK: <span class="stat-boost">${preview.nextStats.atk} (+${preview.nextStats.atk - unit.atk})</span><br>
                        DEF: <span class="stat-boost">${preview.nextStats.def} (+${preview.nextStats.def - unit.def})</span>
                    </div>
                </div>
            `;
        } else {
            afterEl.innerHTML = '<p>Évolution impossible</p>';
        }

        this.updateEvolutionMaterials();
    }

    updateEvolutionMaterials() {
        const unit = this.selectedEvolutionUnit;
        const duplicates = this.game.evolutionSystem.findDuplicates(unit);
        const cost = unit.getEvolutionCost();

        const materialsEl = document.getElementById('evo-materials');
        materialsEl.innerHTML = '';

        if (duplicates.length === 0) {
            materialsEl.innerHTML = '<p>Aucun doublon disponible (Besoin de 2)</p>';
        } else {
            duplicates.forEach(dup => {
                const el = document.createElement('div');
                el.className = 'material-card';
                el.innerHTML = `
                    <div class="char-name">${dup.name}</div>
                    <div class="char-level">Niv. ${dup.level}</div>
                `;
                // Auto-select first 2
                if (this.selectedMaterials.length < 2) {
                    this.selectedMaterials.push(dup);
                    el.classList.add('selected');
                }
                materialsEl.appendChild(el);
            });
        }

        const costEl = document.getElementById('evo-cost');
        const canAfford = this.game.economySystem.resources.gold >= cost;
        costEl.innerHTML = `Coût: <span class="${canAfford ? 'cost-ok' : 'cost-error'}">${cost} Or</span>`;

        // Update Button
        const btnEvolve = document.getElementById('btn-evolve');
        const check = this.game.evolutionSystem.canPerformEvolution(unit);

        if (check.possible) {
            btnEvolve.disabled = false;
            btnEvolve.textContent = 'Évoluer !';
            btnEvolve.onclick = () => this.performEvolution();
        } else {
            btnEvolve.disabled = true;
            btnEvolve.textContent = check.reason;
        }
    }

    performEvolution() {
        const unit = this.selectedEvolutionUnit;
        const success = this.game.evolutionSystem.evolveUnit(unit, this.selectedMaterials);

        if (success) {
            alert(`Félicitations ! ${unit.name} a évolué !`);
            this.showScreen(this.screens.EQUIPMENT); // Return to team screen
            this.updateEquipmentScreen(); // Refresh
        } else {
            alert("Erreur lors de l'évolution");
        }
    }

    openGuildScreen() {
        this.showScreen(this.screens.GUILD);
        this.updateGuildScreen('summon'); // Default tab
    }

    updateGuildScreen(activeTab) {
        // Update Tabs UI
        document.querySelectorAll('.guild-tab').forEach(tab => {
            if (tab.dataset.tab === activeTab) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update Content Visibility
        document.querySelectorAll('.guild-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${activeTab}`).classList.add('active');

        // Hide/show back button based on tab
        const backButton = document.getElementById('btn-back-guild');
        if (backButton) {
            if (activeTab === 'blacksmith' || activeTab === 'shop') {
                backButton.style.display = 'none';
            } else {
                backButton.style.display = 'block';
            }
        }

        // Update screens when switching tabs
        if (activeTab === 'blacksmith') {
            this.updateBlacksmithScreen();
        } else if (activeTab === 'shop') {
            this.updateShopScreen();
        }
    }

    performSummon() {
        const result = this.game.gachaSystem.summonSingle();

        if (result.success) {
            this.showSummonAnimation(result.unit);
            this.updateResourceDisplay(); // Update gems
        } else {
            alert(result.error);
        }
    }

    performMultiSummon() {
        const result = this.game.gachaSystem.summonMulti();

        if (result.success) {
            // Show animation for all 10 units
            this.showMultiSummonAnimation(result.units);
            this.updateResourceDisplay(); // Update gems
        } else {
            alert(result.error);
        }
    }

    showSummonAnimation(unit) {
        const overlay = document.getElementById('summon-overlay');
        const crystal = overlay.querySelector('.summon-crystal');
        const resultCard = document.getElementById('summon-result-card');
        const closeBtn = document.getElementById('btn-close-summon');

        overlay.style.display = 'flex';
        crystal.style.display = 'block';
        resultCard.style.display = 'none';
        closeBtn.style.display = 'none';

        // Simple animation sequence
        setTimeout(() => {
            crystal.style.transform = 'scale(1.5) rotate(360deg)';
            crystal.style.opacity = '0';
        }, 1000);

        setTimeout(() => {
            crystal.style.display = 'none';
            this.showSummonResult(unit);
        }, 1500);
    }

    showMultiSummonAnimation(units) {
        const overlay = document.getElementById('summon-overlay');
        const crystal = overlay.querySelector('.summon-crystal');
        const resultCard = document.getElementById('summon-result-card');
        const closeBtn = document.getElementById('btn-close-summon');

        overlay.style.display = 'flex';
        crystal.style.display = 'block';
        resultCard.style.display = 'none';
        closeBtn.style.display = 'none';

        // Animation du cristal
        setTimeout(() => {
            crystal.style.transform = 'scale(1.5) rotate(360deg)';
            crystal.style.opacity = '0';
        }, 1000);

        // Afficher les résultats après l'animation
        setTimeout(() => {
            crystal.style.display = 'none';
            this.showMultiSummonResults(units);
        }, 1500);
    }

    showMultiSummonResults(units) {
        const resultCard = document.getElementById('summon-result-card');
        const closeBtn = document.getElementById('btn-close-summon');

        // Créer une grille pour afficher les 10 unités
        const colors = {
            'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
            'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
        };

        let html = '<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; max-width: 600px;">';

        units.forEach(unit => {
            const color = colors[unit.element] || '#95a5a6';
            html += `
                <div style="background: ${color}; padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 2em;">${unit.getAvatar()}</div>
                    <div style="font-size: 0.8em; margin-top: 5px;">${unit.name}</div>
                    <div style="color: #ffd700; font-size: 0.9em;">${unit.getRarityStars()}</div>
                </div>
            `;
        });

        html += '</div>';
        html += '<p style="margin-top: 15px; font-size: 1.1em;">🎉 10 héros obtenus !</p>';

        resultCard.innerHTML = html;
        resultCard.style.display = 'block';
        closeBtn.style.display = 'block';
    }

    showSummonResult(unit) {
        const resultCard = document.getElementById('summon-result-card');
        const closeBtn = document.getElementById('btn-close-summon');

        const colors = {
            'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
            'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
        };

        resultCard.innerHTML = `
            <div class="summon-flash"></div>
            <div class="hero-avatar-large" style="background-color: ${colors[unit.element]}; width: 100px; height: 100px; margin: 0 auto 15px;"></div>
            <h2>${unit.name}</h2>
            <div style="color: #ffd700; font-size: 1.5em; margin-bottom: 10px;">${unit.getRarityStars()}</div>
            <div class="new-badge">NOUVEAU !</div>
            <div class="summon-stats">
                <div>HP: ${unit.maxHp}</div>
                <div>ATK: ${unit.atk}</div>
                <div>DEF: ${unit.def}</div>
            </div>
        `;

        resultCard.style.display = 'block';
        closeBtn.style.display = 'block';

        // Reset crystal for next time
        const crystal = document.querySelector('.summon-crystal');
        crystal.style.transform = 'scale(1)';
        crystal.style.opacity = '1';
    }

    updateBlacksmithScreen(filter = 'all') {
        const list = document.getElementById('blacksmith-items');
        if (!list) return;

        let items = this.game.economySystem.inventory.filter(item =>
            item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory'
        );

        // Apply filter
        if (filter !== 'all') {
            items = items.filter(item => item.type === filter);
        }

        // Update counter
        const counter = document.getElementById('equipment-count');
        if (counter) counter.textContent = `(${items.length})`;

        // Update gold display
        const goldAmount = document.getElementById('blacksmith-gold-amount');
        if (goldAmount) goldAmount.textContent = this.game.economySystem.resources.gold;

        // Render grid
        list.innerHTML = '';

        if (items.length === 0) {
            list.innerHTML = '<p class="empty-message">Aucun équipement améliorable</p>';
            return;
        }

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'blacksmith-item-card';
            if (this.selectedBlacksmithItem === item) el.classList.add('selected');

            // Icon based on type
            const icon = item.type === 'weapon' ? '⚔️' : item.type === 'armor' ? '🛡️' : '💍';

            // Determine rarity based on total stats
            const totalStats = Object.values(item.stats).reduce((sum, val) => sum + val, 0);
            let rarityClass = 'common';
            if (totalStats >= 100) rarityClass = 'legendary';
            else if (totalStats >= 70) rarityClass = 'epic';
            else if (totalStats >= 40) rarityClass = 'rare';
            else if (totalStats >= 20) rarityClass = 'uncommon';

            // Determine tier based on level
            let tierClass = 'tier1';
            if (item.level >= 9) tierClass = 'tier4';
            else if (item.level >= 6) tierClass = 'tier3';
            else if (item.level >= 3) tierClass = 'tier2';

            el.classList.add(`rarity-${rarityClass}`);

            el.innerHTML = `
                <div class="item-icon">${icon}</div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-level ${tierClass}">+${item.level}</div>
                </div>
            `;
            el.onclick = () => this.selectBlacksmithItem(item);
            list.appendChild(el);
        });
    }

    selectBlacksmithItem(item) {
        this.selectedBlacksmithItem = item;
        this.selectedBlacksmithMaterial = null;
        this.updateBlacksmithScreen(); // Refresh selection highlight

        const previewEl = document.getElementById('blacksmith-preview');
        const materialsSection = document.getElementById('blacksmith-materials');
        const materialSlot = document.getElementById('blacksmith-material-slot');
        const costEl = document.getElementById('blacksmith-cost');
        const btnUpgrade = document.getElementById('btn-upgrade');

        // Déterminer si on passe un palier
        const currentTier = Math.ceil(item.level / 2);
        const nextTier = Math.ceil((item.level + 1) / 2);
        const isTierUp = nextTier > currentTier;

        // Preview Stats
        const nextStats = this.game.blacksmithSystem.getPreviewStats(item);
        let statsHtml = '';
        for (let key in item.stats) {
            const bonus = this.game.blacksmithSystem.getStatBonus(item.level + 1, key);
            const bonusText = bonus.type === 'percent'
                ? `+${Math.floor(bonus.value * 100)}%`
                : `+${bonus.value}`;

            statsHtml += `<div>${key.toUpperCase()}: ${item.stats[key]} → <span class="stat-boost">${nextStats[key]}</span> <span class="bonus-indicator">(${bonusText})</span></div>`;
        }

        const tierBadge = isTierUp
            ? `<span class="tier-up-badge">🌟 PALIER ${nextTier} 🌟</span>`
            : '';

        previewEl.innerHTML = `
            <h3>${item.name} +${item.level} → +${item.level + 1}</h3>
            ${tierBadge}
            <div class="upgrade-stats">${statsHtml}</div>
        `;

        // Check Requirements
        const cost = this.game.blacksmithSystem.getUpgradeCost(item);
        const canAffordGold = this.game.economySystem.resources.gold >= cost.gold;

        if (cost.requiresMaterial) {
            materialsSection.style.display = 'block';
            const materials = this.game.blacksmithSystem.findMaterials(item);

            if (materials.length > 0) {
                // Auto-select first material
                this.selectedBlacksmithMaterial = materials[0];
                materialSlot.innerHTML = `
                    <div class="material-card selected">
                        <div class="item-name">${this.selectedBlacksmithMaterial.name}</div>
                        <div class="item-level">+${this.selectedBlacksmithMaterial.level}</div>
                    </div>
                `;
            } else {
                materialSlot.innerHTML = `<p class="error-text">Aucun doublon +${item.level} trouvé</p>`;
            }
        } else {
            materialsSection.style.display = 'none';
        }

        // Cost Display
        costEl.innerHTML = `Coût: <span class="${canAffordGold ? 'cost-ok' : 'cost-error'}">${cost.gold} Or</span>`;

        // Button State
        const check = this.game.blacksmithSystem.canUpgrade(item, this.selectedBlacksmithMaterial);
        if (check.possible) {
            btnUpgrade.disabled = false;
            btnUpgrade.textContent = 'Améliorer';
            btnUpgrade.onclick = () => this.performUpgrade();
        } else {
            btnUpgrade.disabled = true;
            btnUpgrade.textContent = check.reason;
        }
    }

    performUpgrade() {
        const item = this.selectedBlacksmithItem;
        const material = this.selectedBlacksmithMaterial;

        if (this.game.blacksmithSystem.upgradeItem(item, material)) {
            this.selectBlacksmithItem(item); // Refresh view
            this.updateResourceDisplay();
        } else {
            alert("Échec de l'amélioration");
        }
    }

    updateShopScreen() {
        const shopGrid = document.getElementById('shop-items');
        const inventoryGrid = document.getElementById('shop-player-inventory');
        const specialGrid = document.getElementById('special-offers');
        if (!shopGrid || !inventoryGrid) return;

        // Generate special offers (rotates every 3 hours)
        if (specialGrid) {
            const now = Date.now();
            const threeHours = 3 * 60 * 60 * 1000;
            const rotationIndex = Math.floor(now / threeHours) % 4; // 4 different rotations

            const allSpecialItems = [
                // Rotation 0
                [
                    { id: 'legendary_sword', name: 'Épée Légendaire', desc: 'Arme de héros', slot: 'weapon', stats: { atk: 50, def: 10 }, price: 5000 },
                    { id: 'dragon_armor', name: 'Armure du Dragon', desc: 'Protection ultime', slot: 'armor', stats: { def: 60, maxHp: 200 }, price: 8000 },
                    { id: 'phoenix_ring', name: 'Anneau du Phénix', desc: 'Résurrection', slot: 'accessory', stats: { maxHp: 150, atk: 20 }, price: 6000 },
                ],
                // Rotation 1
                [
                    { id: 'thunder_blade', name: 'Lame de Foudre', desc: 'Électricité pure', slot: 'weapon', stats: { atk: 45, maxHp: 50 }, price: 4500 },
                    { id: 'titan_shield', name: 'Bouclier Titan', desc: 'Invincible', slot: 'armor', stats: { def: 70, atk: 10 }, price: 7000 },
                    { id: 'mana_crystal', name: 'Cristal de Mana', desc: 'Pouvoir magique', slot: 'accessory', stats: { maxHp: 100, def: 20 }, price: 5500 },
                ],
                // Rotation 2
                [
                    { id: 'void_sword', name: 'Épée du Vide', desc: 'Néant absolu', slot: 'weapon', stats: { atk: 55, def: 5 }, price: 5500 },
                    { id: 'celestial_armor', name: 'Armure Céleste', desc: 'Bénédiction divine', slot: 'armor', stats: { def: 50, maxHp: 250 }, price: 9000 },
                    { id: 'eternal_gem', name: 'Gemme Éternelle', desc: 'Immortalité', slot: 'accessory', stats: { maxHp: 200, atk: 15 }, price: 7500 },
                ],
                // Rotation 3
                [
                    { id: 'demon_blade', name: 'Lame Démoniaque', desc: 'Pouvoir maudit', slot: 'weapon', stats: { atk: 60, maxHp: 30 }, price: 6000 },
                    { id: 'angel_plate', name: 'Plastron d\'Ange', desc: 'Protection sacrée', slot: 'armor', stats: { def: 55, maxHp: 180 }, price: 7500 },
                    { id: 'soul_amulet', name: 'Amulette d\'\u00c2me', desc: 'Essence vitale', slot: 'accessory', stats: { maxHp: 120, def: 30 }, price: 6500 },
                ],
            ];

            const specialItems = allSpecialItems[rotationIndex];

            // Update timer
            const timeUntilNext = threeHours - (now % threeHours);
            const hours = Math.floor(timeUntilNext / (60 * 60 * 1000));
            const minutes = Math.floor((timeUntilNext % (60 * 60 * 1000)) / (60 * 1000));
            const timerEl = document.getElementById('special-timer');
            if (timerEl) {
                timerEl.textContent = `(Renouvellement dans ${hours}h ${minutes}m)`;
            }

            // Populate special offers
            specialGrid.innerHTML = '';
            specialItems.forEach((itemData, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'special-item-wrapper';

                const el = document.createElement('div');
                el.className = 'special-item-card';

                let statsHtml = '';
                for (let key in itemData.stats) {
                    statsHtml += `<div>${key.toUpperCase()}: +${itemData.stats[key]}</div>`;
                }

                el.innerHTML = `
                    <div class="item-name">${itemData.name}</div>
                    <div class="item-type">${itemData.slot}</div>
                    <div class="item-stats">${statsHtml}</div>
                `;

                const priceLabel = document.createElement('div');
                priceLabel.className = 'special-price-label';
                priceLabel.textContent = `${itemData.price} Or`;

                wrapper.dataset.index = index;
                wrapper.addEventListener('click', () => {
                    this.purchaseItem(itemData);
                });

                wrapper.appendChild(el);
                wrapper.appendChild(priceLabel);
                specialGrid.appendChild(wrapper);
            });
        }

        // Populate player inventory
        inventoryGrid.innerHTML = '';
        const playerInventory = this.game.economySystem.inventory;

        playerInventory.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'shop-item-card shop-inventory-item';

            let statsHtml = '';
            for (let key in item.stats) {
                statsHtml += `<div>${key.toUpperCase()}: +${item.stats[key]}</div>`;
            }

            const levelText = item.level > 0 ? ` +${item.level}` : '';
            const sellPrice = item.level > 0 ? item.level * 50 : 10; // Base price 10 for level 0, 50 per level
            el.innerHTML = `
                <div class="item-name">${item.name}${levelText}</div>
                <div class="item-type">${item.type || item.slot}</div>
                <div class="item-stats">${statsHtml}</div>
                <div class="sell-price">Vendre: ${sellPrice} Or</div>
            `;

            // Make card clickable to sell
            el.addEventListener('click', () => {
                this.sellItem(item, index);
            });

            inventoryGrid.appendChild(el);
        });

        // Liste d'équipements à vendre (avec prix)
        const shopItems = [
            { id: 'sword_shop', name: 'Épée de Fer', desc: 'Épée basique', slot: 'weapon', stats: { atk: 10, def: 2 }, price: 100 },
            { id: 'sword_shop', name: 'Épée de Fer', desc: 'Épée basique', slot: 'weapon', stats: { atk: 10, def: 2 }, price: 100 },
            { id: 'sword_shop', name: 'Épée de Fer', desc: 'Épée basique', slot: 'weapon', stats: { atk: 10, def: 2 }, price: 100 },
            { id: 'armor_shop', name: 'Armure de Fer', desc: 'Protection solide', slot: 'armor', stats: { def: 15, maxHp: 50 }, price: 150 },
            { id: 'armor_shop', name: 'Armure de Fer', desc: 'Protection solide', slot: 'armor', stats: { def: 15, maxHp: 50 }, price: 150 },
            { id: 'ring_shop', name: 'Anneau de Vie', desc: 'Augmente la vitalité', slot: 'accessory', stats: { maxHp: 30 }, price: 80 },
            { id: 'ring_shop', name: 'Anneau de Vie', desc: 'Augmente la vitalité', slot: 'accessory', stats: { maxHp: 30 }, price: 80 },
            { id: 'ring_shop', name: 'Anneau de Vie', desc: 'Augmente la vitalité', slot: 'accessory', stats: { maxHp: 30 }, price: 80 },
        ];

        shopGrid.innerHTML = '';
        shopItems.forEach((itemData, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'shop-item-wrapper';

            const el = document.createElement('div');
            el.className = 'shop-item-card';

            let statsHtml = '';
            for (let key in itemData.stats) {
                statsHtml += `<div>${key.toUpperCase()}: +${itemData.stats[key]}</div>`;
            }

            el.innerHTML = `
                <div class="item-name">${itemData.name}</div>
                <div class="item-type">${itemData.slot}</div>
                <div class="item-stats">${statsHtml}</div>
            `;

            const priceLabel = document.createElement('div');
            priceLabel.className = 'buy-price-label';
            priceLabel.textContent = `${itemData.price} Or`;

            // Make entire wrapper clickable
            wrapper.dataset.index = index;
            wrapper.addEventListener('click', () => {
                this.purchaseItem(shopItems[index]);
            });

            wrapper.appendChild(el);
            wrapper.appendChild(priceLabel);
            shopGrid.appendChild(wrapper);
        });

        // Update inventory count in title
        const inventoryCount = this.game.economySystem.inventory.length;
        const maxInventory = this.game.economySystem.maxInventorySize;
        const shopTitles = document.querySelectorAll('#tab-shop h3');
        if (shopTitles[0]) {
            shopTitles[0].innerHTML = `Votre Inventaire <span style="color: ${inventoryCount >= maxInventory * 0.8 ? '#e74c3c' : '#2ecc71'}; font-size: 0.8em;">(${inventoryCount}/${maxInventory})</span>`;
        }

        // Update gold display
        const goldAmount = document.getElementById('shop-gold-amount');
        if (goldAmount) {
            goldAmount.textContent = this.game.economySystem.resources.gold;
        }
    }

    purchaseItem(itemData) {
        // Check gold
        if (this.game.economySystem.resources.gold < itemData.price) {
            this.showShopModal('Pas assez d\'or !', 'error');
            return;
        }

        // Check inventory space
        if (this.game.economySystem.inventory.length >= this.game.economySystem.maxInventorySize) {
            this.showShopModal('Inventaire plein !', 'error');
            return;
        }

        // Import Equipment dynamically
        import('../items/Equipment.js').then(module => {
            const Equipment = module.default;
            const newItem = new Equipment(itemData.id, itemData.name, itemData.desc, itemData.slot, itemData.stats);
            newItem.type = itemData.slot;

            // Add to inventory
            this.game.economySystem.inventory.push(newItem);

            // Deduct gold
            this.game.economySystem.resources.gold -= itemData.price;

            // Update UI
            this.updateResourceDisplay();
            this.updateShopScreen(); // IMPORTANT: Refresh shop to show new item

            console.log(`Acheté: ${itemData.name}`);
            this.showShopModal(`${itemData.name} acheté !`, 'success');
        });
    }

    sellItem(item, index) {
        // Check if item is equipped
        const equippedOnHero = this.game.partyManager.party.find(hero => {
            return hero && Object.values(hero.equipment || {}).includes(item);
        });

        if (equippedOnHero) {
            this.showShopModal('Impossible de vendre un équipement équipé !', 'error');
            return;
        }

        // Calculate sell price (50 gold per level, base 10 for level 0)
        const sellPrice = item.level > 0 ? item.level * 50 : 10;

        // Show custom confirmation modal
        this.showShopConfirm(
            `Vendre ${item.name}${item.level > 0 ? ' +' + item.level : ''} pour ${sellPrice} Or ?`,
            () => {
                // Remove from inventory
                this.game.economySystem.inventory.splice(index, 1);

                // Add gold
                this.game.economySystem.resources.gold += sellPrice;

                // Update UI
                this.updateResourceDisplay();
                this.updateShopScreen();

                console.log(`Vendu: ${item.name} pour ${sellPrice} Or`);
                this.showShopModal(`${item.name} vendu pour ${sellPrice} Or !`, 'success');
            }
        );
    }

    showShopModal(message, type = 'info') {
        const modal = document.createElement('div');
        modal.className = 'shop-modal';
        modal.innerHTML = `
            <div class="shop-modal-content ${type}">
                <p>${message}</p>
                <button class="shop-modal-btn">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        const btn = modal.querySelector('.shop-modal-btn');
        btn.addEventListener('click', () => {
            modal.remove();
        });

        // Auto-close after 2 seconds
        setTimeout(() => {
            if (modal.parentElement) modal.remove();
        }, 2000);
    }

    showShopConfirm(message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'shop-modal';
        modal.innerHTML = `
            <div class="shop-modal-content confirm">
                <p>${message}</p>
                <div class="shop-modal-buttons">
                    <button class="shop-modal-btn cancel">Annuler</button>
                    <button class="shop-modal-btn confirm">Confirmer</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const cancelBtn = modal.querySelector('.cancel');
        const confirmBtn = modal.querySelector('.confirm');

        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });

        confirmBtn.addEventListener('click', () => {
            modal.remove();
            onConfirm();
        });
    }

    // --- AUTHENTICATION METHODS ---

    /**
     * Shows the authentication screen
     */
    showAuthScreen() {
        // Check if already logged in
        if (this.game.onlineSystem && this.game.onlineSystem.isOnline) {
            this.showScreen(this.screens.MAIN_MENU);
            return;
        }

        let authScreen = document.getElementById('auth-screen');

        if (!authScreen) {
            authScreen = this.createAuthScreen();
            this.uiLayer.appendChild(authScreen);
        }

        // Hide all other screens
        Object.values(this.screens).forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) screen.style.display = 'none';
        });

        authScreen.style.display = 'flex';
        this.currentScreen = 'auth-screen';
    }

    /**
     * Creates the authentication screen HTML
     */
    createAuthScreen() {
        const authScreen = document.createElement('div');
        authScreen.id = 'auth-screen';
        authScreen.className = 'auth-screen';

        authScreen.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h1 class="auth-title">🌳 The Dying World Tree</h1>
                    <p class="auth-subtitle">Connectez-vous pour sauvegarder votre progression</p>
                </div>

                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Connexion</button>
                    <button class="auth-tab" data-tab="register">Inscription</button>
                </div>

                <!-- Error/Success Messages -->
                <div class="auth-error" id="auth-error"></div>
                <div class="auth-success" id="auth-success"></div>

                <!-- Login Form -->
                <form class="auth-form active" id="login-form">
                    <div class="auth-input-group">
                        <label class="auth-label" for="login-email">Email</label>
                        <input type="email" id="login-email" class="auth-input" placeholder="votre@email.com" required>
                    </div>
                    <div class="auth-input-group">
                        <label class="auth-label" for="login-password">Mot de passe</label>
                        <input type="password" id="login-password" class="auth-input" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="auth-button" id="btn-login">
                        Se connecter
                    </button>
                </form>

                <!-- Register Form -->
                <form class="auth-form" id="register-form">
                    <div class="auth-input-group">
                        <label class="auth-label" for="register-username">Nom d'utilisateur</label>
                        <input type="text" id="register-username" class="auth-input" placeholder="Votre pseudo" required>
                    </div>
                    <div class="auth-input-group">
                        <label class="auth-label" for="register-email">Email</label>
                        <input type="email" id="register-email" class="auth-input" placeholder="votre@email.com" required>
                    </div>
                    <div class="auth-input-group">
                        <label class="auth-label" for="register-password">Mot de passe</label>
                        <input type="password" id="register-password" class="auth-input" placeholder="••••••••" required minlength="6">
                    </div>
                    <button type="submit" class="auth-button" id="btn-register">
                        Créer un compte
                    </button>
                </form>

                <div class="auth-footer">
                    <button class="auth-guest-button" id="btn-guest">
                        Continuer sans compte
                    </button>
                </div>
            </div>
        `;

        // Bind events
        this.bindAuthEvents(authScreen);

        return authScreen;
    }

    /**
     * Binds authentication screen events
     */
    bindAuthEvents(authScreen) {
        // Tab switching
        const tabs = authScreen.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission if inside form
                // Update tab active state
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update form visibility
                const targetTab = tab.dataset.tab;
                authScreen.querySelectorAll('.auth-form').forEach(form => {
                    form.classList.remove('active');
                });
                authScreen.querySelector(`#${targetTab}-form`).classList.add('active');

                // Clear messages
                this.hideAuthMessage();
            });
        });

        // Login form
        const loginForm = authScreen.querySelector('#login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Register form
        const registerForm = authScreen.querySelector('#register-form');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Guest button
        const guestBtn = authScreen.querySelector('#btn-guest');
        guestBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen(this.screens.MAIN_MENU);
        });
    }

    /**
     * Handles user login
     */
    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('btn-login');

        this.hideAuthMessage();
        btn.disabled = true;
        btn.innerHTML = 'Connexion...<span class="auth-loading"></span>';

        try {
            const result = await this.game.onlineSystem.login(email, password);

            if (result.success) {
                this.showAuthSuccess('Connexion réussie ! Bienvenue ' + result.user.username);
                setTimeout(() => {
                    this.showScreen(this.screens.MAIN_MENU);
                }, 1500);
            } else {
                this.showAuthError(result.error || 'Erreur de connexion');
            }
        } catch (error) {
            this.showAuthError('Erreur de connexion au serveur');
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Se connecter';
        }
    }

    /**
     * Handles user registration
     */
    async handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const btn = document.getElementById('btn-register');

        this.hideAuthMessage();
        btn.disabled = true;
        btn.innerHTML = 'Création...<span class="auth-loading"></span>';

        try {
            const result = await this.game.onlineSystem.register(username, email, password);

            if (result.success) {
                this.showAuthSuccess('Compte créé ! Bienvenue ' + result.user.username);
                setTimeout(() => {
                    this.showScreen(this.screens.MAIN_MENU);
                }, 1500);
            } else {
                this.showAuthError(result.error || 'Erreur lors de la création du compte');
            }
        } catch (error) {
            this.showAuthError('Erreur de connexion au serveur');
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Créer un compte';
        }
    }

    /**
     * Handles user logout
     */
    async handleLogout() {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            await this.game.onlineSystem.logout();
            this.showAuthScreen();
        }
    }

    /**
     * Shows error message
     */
    showAuthError(message) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    /**
     * Shows success message
     */
    showAuthSuccess(message) {
        const successEl = document.getElementById('auth-success');
        if (successEl) {
            successEl.textContent = message;
            successEl.classList.add('show');
        }
    }

    /**
     * Hides all auth messages
     */
    hideAuthMessage() {
        const errorEl = document.getElementById('auth-error');
        const successEl = document.getElementById('auth-success');
        if (errorEl) errorEl.classList.remove('show');
        if (successEl) successEl.classList.remove('show');
    }
}

