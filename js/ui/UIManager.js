import UIFormationManager from './UIFormationManager.js';
import { BUILDING_DATABASE, getAllBuildingIds, getProduction } from '../data/BuildingDatabase.js';
import { AssetManager } from '../utils/AssetManager.js';

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
            STORY: 'story-screen',
            EVOLUTION: 'evolution-screen',
            GUILD: 'guild-screen',
            AUTH: 'auth-screen',
            VILLAGE: 'village-screen',
            CRAFTING: 'crafting-screen',
            FORMATION: 'formation-screen'
        };

        this.formationManager = new UIFormationManager(game, this);

        this.initScreens();

        // Show Auth Screen if not logged in, otherwise Main Menu
        if (this.game.onlineSystem && this.game.onlineSystem.isOnline) {
            this.showScreen(this.screens.MAIN_MENU);
        } else {
            // DEBUG: Bypass Auth for testing
            this.game.villageSystem.buildings = {
                town_hall: { level: 1 },
                forge: { level: 1 }, // Level 1 unlocks button
                sanctuary: { level: 1 },
                crystal_mine: { level: 1 },
                alchemy_lab: { level: 1 },
                market: { level: 1 },
                // Add others if needed to prevent errors, but undefined is handled in grid
            };
            this.showVillage();
            // this.showAuthScreen();
        }

        // Hide debug overlay after initialization
        const debugOverlay = document.getElementById('debug-overlay');
        if (debugOverlay) {
            debugOverlay.style.display = 'none';
        }
    }

    initScreens() {
        // Clear existing content
        const debug = document.getElementById('debug-overlay');
        this.uiLayer.innerHTML = '';
        if (debug) this.uiLayer.appendChild(debug);

        // --- VILLAGE HUB (Nouveau Menu Principal) ---
        // La création est gérée plus bas ou dans une méthode dédiée pour éviter les doublons


        // Initialisation des autres écrans (Battle, Equip, etc.)
        this.initLegacyScreens();

        // Setup Event Listeners pour le Village
        this.setupVillageListeners();
    }

    setupVillageListeners() {
        // Dock navigation removed for scene immersion
        // document.getElementById('btn-dock-hero').onclick = () => this.showScreen(this.screens.FORMATION);
        // document.getElementById('btn-dock-inv').onclick = () => this.showScreen(this.screens.INVENTORY);

        // Redirection des anciens boutons si nécessaire
    }

    showVillage() {
        this.showScreen(this.screens.VILLAGE);
    }

    updateVillageVisuals() {
        const villageSystem = this.game.villageSystem;
        const sanctuary = villageSystem.buildings['sanctuary'];

        // Sécurité si le sanctuaire n'existe pas encore (fallback level 1)
        let level = sanctuary ? sanctuary.level : 1;

        // Clamp level entre 1 et 7 (au cas où on dépasse 7 plus tard)
        if (level < 1) level = 1;
        if (level > 7) level = 7;

        const bgContainer = document.getElementById('village-background');
        const tierLabel = document.getElementById('village-tier-label');
        const mainContainer = document.getElementById(this.screens.VILLAGE);

        // 1. Update Background
        // Images: assets/backgrounds/village_bg_lvl_1.png à village_bg_lvl_7.png
        const bgImage = `url("assets/backgrounds/village_bg_lvl_${level}.png")`;

        // Update Title based on Level

        let tierName = '';
        switch (level) {
            case 1: tierName = 'Camp de Survivants (Ruines)'; break;
            case 2: tierName = 'Hameau Reconstruit'; break;
            case 3: tierName = 'Village Fortifié'; break;
            case 4: tierName = 'Bastion de Pierre'; break;
            case 5: tierName = 'Château en Construction'; break;
            case 6: tierName = 'Grande Forteresse'; break;
            case 7: tierName = 'Citadelle Majestueuse'; break;
            default: tierName = 'Village';
        }

        // Clean old classes (both formats to be safe)
        mainContainer.classList.remove('tier1', 'tier2', 'tier3', 'tier-1', 'tier-2', 'tier-3');
        // Add granular class
        mainContainer.classList.add(`level-${level}`);

        // Add Tier class for styling (Fonts, Borders, etc defined in village-evolution.css)
        if (level <= 3) {
            mainContainer.classList.add('tier-1');
        } else if (level <= 6) {
            mainContainer.classList.add('tier-2');
        } else {
            mainContainer.classList.add('tier-3');
        }

        if (bgContainer) {
            bgContainer.style.backgroundColor = '#1a1a1a';
            bgContainer.style.backgroundImage = bgImage;
            bgContainer.style.backgroundSize = 'cover';
            bgContainer.style.backgroundPosition = 'center';
            // Transition is handled by CSS if defined
        }

        if (tierLabel) tierLabel.textContent = tierName;

        // 2. Render Interactive Buildings Grid
        this.updateVillageScreen();
    }

    updateVillageScreen() {
        const container = document.getElementById('village-background');
        if (!container) return;

        // Clear existing buildings (keep tier label)
        const tierLabel = document.getElementById('village-tier-label');
        // Save tier label to re-append or just clear everything else
        // Easier to just query everything and remove if not label
        Array.from(container.children).forEach(child => {
            if (child.id !== 'village-tier-label') {
                container.removeChild(child);
            }
        });

        // Loop through all buildings in database
        getAllBuildingIds().forEach(buildingId => {
            const buildingData = BUILDING_DATABASE[buildingId];
            if (!buildingData.layout) return;

            // Get current state
            const buildingState = this.game.villageSystem.buildings[buildingId] || { level: 0 };
            const level = buildingState.level;

            // Only show hidden buildings if they are unlocked (optional, for now show all)
            if (buildingData.layout.x === -100) return; // Explicitly hidden

            this.createBuildingElement(container, buildingId, buildingData, level);
        });
    }

    createBuildingElement(container, id, data, level) {
        const el = document.createElement('div');
        el.className = `building-sprite building-${id}`;
        // Basic positioning style
        el.style.position = 'absolute';
        el.style.left = `${data.layout.x}%`;
        el.style.top = `${data.layout.y}%`;
        el.style.zIndex = data.layout.zIndex || 1;
        el.style.transform = `translate(-50%, -50%) scale(${data.layout.scale || 1})`;
        el.style.cursor = 'pointer';

        // Tooltip container (optional, can be CSS hover)
        el.title = `${data.name} (Niv. ${level})`;

        // Image Construction
        // Priority: Specific Level -> Generic Tier -> Fallback
        const img = document.createElement('img');
        img.className = 'building-image';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.transition = 'transform 0.2s';

        // Asset Path Logic
        // Try precise level asset first
        // Note: Using a localized error handler fallback strategy
        // Default assumption: assets/buildings/{id}/{id}_lvl{level}.png
        const baseFolder = `assets/buildings/${id}`;
        const tierFolder = `assets/buildings/tier${Math.min(3, Math.ceil(level / 3))}`; // Approximation

        // Start with ideal path
        // For ruins (level 0), use specific or greyed out level 1
        let finalSrc = level > 0
            ? `${baseFolder}/${id}_lvl${level}.png`
            : `${baseFolder}/${id}_ruins.png`;

        img.src = finalSrc;

        // Fallback chain handled via error event allows graceful degradation without complex checks
        img.onerror = () => {
            // Fallback 1: Try Tier 1 folder (legacy structure)
            img.onerror = () => {
                // Fallback 2: Just show a placeholder or nothing
                console.warn(`Missing asset for ${id} lvl ${level}`);
                img.style.opacity = 0.5; // Visual indicator of missing asset
            };
            img.src = `assets/buildings/tier1/${id}.png`;
        };

        if (level === 0) {
            el.classList.add('building-locked');
            img.style.filter = 'grayscale(100%) brightness(50%)';
        }

        // Hover Effect using JS or CSS class
        el.onmouseenter = () => { img.style.transform = 'scale(1.1)'; img.style.filter = level === 0 ? 'grayscale(100%) brightness(70%)' : 'brightness(120%)'; };
        el.onmouseleave = () => { img.style.transform = 'scale(1)'; img.style.filter = level === 0 ? 'grayscale(100%) brightness(50%)' : 'none'; };

        // Click Interaction
        el.onclick = () => {
            // Animation feedback
            img.style.transform = 'scale(0.95)';
            setTimeout(() => img.style.transform = 'scale(1.1)', 100);

            this.handleBuildingClick(id, data, level);
        };

        el.appendChild(img);

        // Add Floating Label (Always visible or on hover)
        const label = document.createElement('div');
        label.className = 'building-label';
        label.textContent = level > 0 ? `Niv. ${level}` : 'Construire';
        label.style.position = 'absolute';
        label.style.bottom = '-20px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.backgroundColor = 'rgba(0,0,0,0.7)';
        label.style.color = 'white';
        label.style.padding = '2px 6px';
        label.style.borderRadius = '4px';
        label.style.fontSize = '10px';
        label.style.whiteSpace = 'nowrap';
        label.style.pointerEvents = 'none'; // Click through
        el.appendChild(label);

        container.appendChild(el);
    }

    handleBuildingClick(id, data, level) {
        console.log(`Building clicked: ${id}`, data.action);

        if (!data.action) return;

        // Prevent interaction if locked (unless it's to build it?)
        // Assuming we allow clicking to see requirements to build

        const action = data.action;

        if (action.type === 'open_screen') {
            if (this.screens[action.target]) {
                this.showScreen(this.screens[action.target]);
                // Handle specific tabs
                if (action.tab && action.target === 'GUILD') {
                    this.updateGuildScreen(action.tab);
                }
            } else {
                console.error(`Screen ${action.target} not found`);
            }
        }
        else if (action.type === 'open_modal') {
            if (action.target === 'town_hall_info') {
                // Implement Town Hall Modal
                alert("Hôtel de ville - Work in Progress");
            } else if (action.target === 'coming_soon') {
                alert(`${action.title} - Bientôt disponible !`);
            }
        }
        else if (action.type === 'collect') {
            // Trigger collect in VillageSystem
            // Visual feedback needed
            const collected = this.game.villageSystem.collectResources(id);
            if (collected > 0) {
                this.showFloatingText(data.layout.x, data.layout.y, `+${collected} ${action.resource}`, '#2ecc71');
                this.updateResourceDisplay(); // Ensure this exists
            } else {
                this.showFloatingText(data.layout.x, data.layout.y, "Rien à collecter", '#bdc3c7');
            }
        }
    }

    showFloatingText(xPct, yPct, text, color) {
        const container = document.getElementById('village-background');
        const el = document.createElement('div');
        el.textContent = text;
        el.style.position = 'absolute';
        el.style.left = `${xPct}%`;
        el.style.top = `${yPct}%`; // Start at building center
        el.style.transform = 'translate(-50%, -50%)';
        el.style.color = color;
        el.style.fontWeight = 'bold';
        el.style.textShadow = '1px 1px 2px black';
        el.style.pointerEvents = 'none';
        el.style.zIndex = 200;
        el.style.transition = 'all 1s ease-out';

        container.appendChild(el);

        // Animate
        requestAnimationFrame(() => {
            el.style.top = `${yPct - 10}%`; // Float up
            el.style.opacity = 0;
        });

        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 1000);
    }

    showMainMenu() {
        // Legacy redirect
        this.showVillage();
    }


    initLegacyScreens() {
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
    <div class="team-screen-container">
        <!-- Section Équipe Horizontale -->
        <!-- Flex Layout for Side Bonuses & Team -->
        <div class="team-flex-container" style="display: flex; align-items: flex-start; justify-content: center; gap: 10px; margin-bottom: 20px;">

            <!-- Left Bonus Panel -->
            <div id="team-bonus-left" style="flex: 0 0 180px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; min-height: 120px; font-size: 0.85em; border: 1px solid rgba(255,255,255,0.1);">
                <h4 style="margin: 0 0 8px 0; color: #f1c40f; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">Bonus Actifs</h4>
                <div id="bonus-list-left"></div>
            </div>

            <!-- Center Party Section -->
            <div class="team-center-section" style="flex: 0 0 auto;">
                <div class="team-header-compact" style="text-align: center; margin-bottom: 10px;">
                    <h3 style="margin:0;">⚔️ Équipe <span id="party-count" style="font-size: 0.8em; color: #aaa;">(0/5)</span></h3>
                </div>
                <div id="party-units" class="party-list-horizontal"></div>
            </div>

            <!-- Right Bonus Panel -->
            <div id="team-bonus-right" style="flex: 0 0 180px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; min-height: 120px; font-size: 0.85em; border: 1px solid rgba(255,255,255,0.1);">
                <h4 style="margin: 0 0 8px 0; color: #f1c40f; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">Stats Totales</h4>
                <div id="bonus-list-right"></div>
            </div>
        </div>

        <!-- Total Bonus Summary (Visual Bar) -->
        <div id="team-bonus-summary" style="background: rgba(39, 174, 96, 0.2); padding: 8px; border-radius: 5px; text-align: center; margin-bottom: 20px; border: 1px solid #27ae60; font-weight: bold; color: #2ecc71; display: none;">
            📊 Total: <span id="bonus-summary-text">Aucun bonus</span>
        </div>

        <!-- Section Héros Disponibles (With Filters) -->
        <div class="available-heroes-section">
            <div class="inventory-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3>Héros Disponibles <span id="total-hero-count" style="font-size: 0.8em; color: #aaa;">(0/50)</span></h3>

                <!-- Filters -->
                <div class="inventory-filters" style="display: flex; gap: 5px;">
                    <select id="filter-element" style="padding: 5px; border-radius: 4px; background: #34495e; color: white; border: 1px solid #7f8c8d;">
                        <option value="all">Tous Éléments</option>
                        <option value="fire">Fire</option>
                        <option value="water">Water</option>
                        <option value="earth">Earth</option>
                        <option value="thunder">Thunder</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                    <select id="filter-role" style="padding: 5px; border-radius: 4px; background: #34495e; color: white; border: 1px solid #7f8c8d;">
                        <option value="all">Tous Rôles</option>
                        <option value="Tank">Tank</option>
                        <option value="Warrior">Warrior</option>
                        <option value="Mage">Mage</option>
                        <option value="Ranger">Ranger</option>
                        <option value="Support">Support</option>
                        <option value="Assassin">Assassin</option>
                    </select>
                </div>
            </div>
            <div id="equipment-grid" class="available-heroes-grid"></div>
        </div>
    </div>
`;
        equipScreen.style.display = 'none';
        this.uiLayer.appendChild(equipScreen);

        // Event Listeners for Equipment Screen (Must be added after appending)
        const btnEquipExit = document.getElementById('btn-equip-exit');
        if (btnEquipExit) {
            btnEquipExit.onclick = () => {
                this.showScreen(this.screens.MAIN_MENU);
            };
        }

        // Filter Listeners
        const filterElement = document.getElementById('filter-element');
        if (filterElement) {
            filterElement.onchange = () => this.renderAvailableHeroes();
        }
        const filterRole = document.getElementById('filter-role');
        if (filterRole) {
            filterRole.onchange = () => this.renderAvailableHeroes();
        }

        // Create Battle HUD
        const battleHud = document.createElement('div');
        battleHud.id = this.screens.BATTLE_HUD;
        battleHud.className = 'screen';
        battleHud.innerHTML = `
    <div id = "battle-info" style = "font-size: 1.2em; font-weight: bold; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 8px;"> Combat en cours</div>
            
            <div id="battle-portraits-container" style="
                position: absolute; 
                bottom: 20px; 
                left: 50%; 
                transform: translateX(-50%); 
                display: flex; 
                gap: 15px; 
                /* width: 80%; */
                justify-content: center;
                align-items: flex-end;
            ">
                <!-- Portraits injected via updateBattleUI -->
            </div>

            <button id="btn-flee" style="
                position: absolute; 
                top: 20px; 
                right: 20px; 
                padding: 10px 20px; 
                background: #c0392b; 
                color: white; 
                border: none; 
                border-radius: 5px; 
                font-family: inherit; 
                cursor: pointer;
            ">🏃 Fuir</button>

`;
        battleHud.style.display = 'none';
        this.uiLayer.appendChild(battleHud);

        // Battle HUD Listeners
        // New Unit Listeners are dynamic in updateBattleUI


        document.getElementById('btn-flee').addEventListener('click', () => {
            this.game.endBattle(false); // Flee = defeat/end
        });

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
                    <div class="shop-exit-btn" id="btn-back-inventory">
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
        const invExitBtn = inventoryScreen.querySelector('#btn-back-inventory');
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
            <h2 > Sélectionner une Quête</h2>
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
            <h2 >🌟 Évolution</h2>
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
            


            <!--Summon Animation Overlay-- >
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

        // Create Village Screen
        const villageScreen = document.createElement('div');
        villageScreen.id = 'village-screen';
        villageScreen.className = 'screen village-screen';
        villageScreen.innerHTML = `
            <div class="village-header">
                <div class="shop-exit-btn" id="btn-village-exit">
                    <div class="door-icon">🚪</div>
                    <span>Sortie</span>
                </div>
                <h2>🏘️ Village</h2>
                <!--Resources moved to separate container-->
            </div>
            <div class="village-resources-container">
                <!-- Resources will be injected here -->
            </div>
            <div id="village-background" class="buildings-container" style="position: relative; flex: 1; width: 100%; overflow: hidden;">
                <div class="buildings-grid" style="display: none;">
                    <!-- Buildings will be injected here -->
                </div>
                <div id="village-tier-label" style="position: absolute; top: 10px; left: 10px; color: rgba(255,255,255,0.7); font-size: 0.8em; z-index: 100;"></div>
            </div>
        `;
        villageScreen.style.display = 'none';
        this.uiLayer.appendChild(villageScreen);

        // Create Crafting Screen
        const craftingScreen = document.createElement('div');
        craftingScreen.id = 'crafting-screen';
        craftingScreen.className = 'screen crafting-screen';
        craftingScreen.innerHTML = `
            <div class="village-header">
                <div class="shop-exit-btn" id="btn-crafting-exit">
                    <div class="door-icon">🚪</div>
                    <span>Sortie</span>
                </div>
                <h2>⚒️ Forge Mystique</h2>
                <div class="village-resources">
                    <!-- Resources will be injected here -->
                </div>
            </div>
            <div class="crafting-container">
                <div class="item-list">
                    <!-- Item list will be injected here -->
                </div>
                <div class="refine-panel">
                    <!-- Refine panel will be injected here -->
                </div>
            </div>
        `;
        craftingScreen.style.display = 'none';
        this.uiLayer.appendChild(craftingScreen);

        // Create Story Screen
        const storyScreen = document.createElement('div');
        storyScreen.id = 'story-screen';
        storyScreen.className = 'screen story-screen';
        storyScreen.innerHTML = `
            <div class="story-header">
                <h2>📖 Mode Histoire</h2>
                <button class="story-back-btn" id="btn-story-back">Retour</button>
            </div>
            
            < !--Zone Selection View-- >
            <div class="zone-selection" id="zone-selection">
                <div class="zones-grid" id="zones-grid">
                    <!-- Zones will be injected here -->
                </div>
            </div>
            
            <!--Stage Selection View-- >
            <div class="stage-selection" id="stage-selection">
                <div class="zone-info" id="zone-info">
                    <!-- Zone info will be injected here -->
                </div>
                <div class="stages-grid" id="stages-grid">
                    <!-- Stages will be injected here -->
                </div>
            </div>
        `;
        storyScreen.style.display = 'none';
        this.uiLayer.appendChild(storyScreen);

        this.bindEvents();

        // Bind logout button
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    updateBattleUI() {
        if (this.currentScreen !== this.screens.BATTLE_HUD) return;

        const container = document.getElementById('battle-portraits-container');
        if (!container) return;

        const party = this.game.battleSystem.playerUnits;

        // Init container if empty (first time)
        // Or partial update? To be smooth (animations), we should update DOM elements not recreate them if possible.
        // For simplicity V1: Recreate if length changes, otherwise update.

        // Checking if we need to full rebuild
        let needRebuild = false;
        if (container.children.length !== party.length) needRebuild = true;

        if (needRebuild) {
            container.innerHTML = '';
            party.forEach(unit => {
                const el = document.createElement('div');
                el.className = 'battle-portrait';
                el.id = `portrait - ${unit.instanceId} `;
                el.style.cssText = `
        width: 80px;
        height: 100px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #555;
        border - radius: 8px;
        position: relative;
        cursor: pointer;
        transition: transform 0.1s, border - color 0.2s;
        display: flex;
        flex - direction: column;
        align - items: center;
        overflow: hidden;
        `;

                // Avatar (Color square for now)
                const avatar = document.createElement('div');
                avatar.style.cssText = `
        width: 100 %;
        height: 60px;
        background - color: ${unit.color || '#ccc'};
        display: flex;
        justify - content: center;
        align - items: center;
        font - size: 24px;
        `;
                avatar.textContent = "👤"; // Placeholder for sprite
                el.appendChild(avatar);

                // Info overlay
                const info = document.createElement('div');
                info.style.cssText = `
        width: 100 %;
        height: 40px;
        padding: 2px;
        box - sizing: border - box;
        background: #222;
        `;

                // HP Bar
                const hpBar = document.createElement('div');
                hpBar.className = 'hp-bar';
                hpBar.style.cssText = `width: 100 %; height: 6px; background: #555; margin - bottom: 2px; border - radius: 2px; overflow: hidden; `;
                const hpFill = document.createElement('div');
                hpFill.className = 'hp-fill';
                hpFill.style.cssText = `width: 100 %; height: 100 %; background: #2ecc71; transition: width 0.2s; `;
                hpBar.appendChild(hpFill);
                info.appendChild(hpBar);

                // ATB Bar (Yellow)
                const atbBar = document.createElement('div');
                atbBar.className = 'atb-bar';
                atbBar.style.cssText = `width: 100 %; height: 6px; background: #555; margin - bottom: 2px; border - radius: 2px; position: relative; overflow: hidden; `;
                const atbFill = document.createElement('div');
                atbFill.className = 'atb-fill';
                atbFill.style.cssText = `width: 0 %; height: 100 %; background: #f1c40f; transition: width 0.1s linear; `;
                atbBar.appendChild(atbFill);
                info.appendChild(atbBar);

                // Soul Power Bar (Purple)
                const spBar = document.createElement('div');
                spBar.className = 'sp-bar';
                spBar.style.cssText = `width: 100 %; height: 8px; background: #444; border - radius: 2px; position: relative; overflow: hidden; `;
                const spFill = document.createElement('div');
                spFill.className = 'sp-fill';
                spFill.style.cssText = `width: 0 %; height: 100 %; background: #9b59b6; transition: width 0.2s; box - shadow: 0 0 5px #9b59b6; `;
                spBar.appendChild(spFill);
                info.appendChild(spBar);

                el.appendChild(info);

                // Click Handler for Ultimate
                el.onclick = () => {
                    this.game.battleSystem.triggerSoulPower(unit);
                };

                container.appendChild(el);
            });
        }

        // Update Values
        party.forEach((unit, index) => {
            const el = container.children[index];
            if (!el) return;

            const maxHp = unit.getStat('maxHp') || 1;
            const hpPct = (unit.hp / maxHp) * 100;
            const atbPct = Math.min(100, unit.actionGauge || 0);
            const spPct = (unit.soulPower / unit.maxSoulPower) * 100;

            el.querySelector('.hp-fill').style.width = `${hpPct}% `;
            el.querySelector('.atb-fill').style.width = `${atbPct}% `;

            const spFill = el.querySelector('.sp-fill');
            spFill.style.width = `${spPct}% `;

            // Visual feedback for Ready Ultimate
            if (unit.isSoulPowerReady()) {
                el.style.borderColor = '#9b59b6'; // Purple glow border
                el.style.boxShadow = '0 0 15px #9b59b6';
                spFill.style.background = '#e056fd'; // Brighter purple
            } else {
                el.style.borderColor = '#555';
                el.style.boxShadow = 'none';
                spFill.style.background = '#9b59b6';
            }

            // Visual feedback for Dead
            if (unit.isDead()) {
                el.style.opacity = '0.5';
                el.style.filter = 'grayscale(100%)';
            } else {
                el.style.opacity = '1';
                el.style.filter = 'none';
            }
        });
    }

    updateEquipmentScreen() {
        this.renderPartySlots();
        this.renderAvailableHeroes();
        // this.renderTeamBonuses(); // DEPRECATED

        // Update counts
        const party = this.game.partyManager.getParty();
        const allUnits = this.game.partyManager.getAllUnits();

        const partyCountEl = document.getElementById('party-count');
        if (partyCountEl) partyCountEl.textContent = `(${party.length} / 5)`;

        const totalCountEl = document.getElementById('total-hero-count');
        if (totalCountEl) totalCountEl.textContent = `(${allUnits.length} / 50)`;
    }

    /**
     * Met à jour l'affichage des bonus d'équipe
     */
    updateTeamBonuses() {
        const leftPanel = document.getElementById('bonus-list-left');
        const rightPanel = document.getElementById('bonus-list-right');
        const summaryPanel = document.getElementById('team-bonus-summary');
        const summaryText = document.getElementById('bonus-summary-text');

        if (!leftPanel || !rightPanel) return;

        const party = this.game.partyManager.getParty();

        if (!this.game.elementalBonusSystem) {
            leftPanel.textContent = "Système non init.";
            return;
        }

        const bonuses = this.game.elementalBonusSystem.calculateTeamBonuses(party);
        const formattedBonuses = this.game.elementalBonusSystem.formatBonusesForUI(bonuses);

        // Clear panels
        leftPanel.innerHTML = '';
        rightPanel.innerHTML = '';

        if (formattedBonuses.length === 0) {
            leftPanel.innerHTML = '<div style="color: #aaa; font-style: italic; text-align: center;">Aucun bonus</div>';
            rightPanel.innerHTML = '<div style="color: #aaa; font-style: italic; text-align: center;">Aucun bonus</div>';
            if (summaryPanel) summaryPanel.style.display = 'none';
        } else {
            // Split bonuses
            formattedBonuses.forEach((text, index) => {
                const item = document.createElement('div');
                item.style.marginBottom = '4px';
                item.innerHTML = `✅ ${text} `;

                if (index % 2 === 0) {
                    leftPanel.appendChild(item);
                } else {
                    rightPanel.appendChild(item);
                }
            });

            // Update Summary
            if (summaryPanel && summaryText) {
                const summary = this.game.elementalBonusSystem.getTotalBonusSummary(bonuses);
                const parts = [];
                if (summary.totalAtk > 0) parts.push(`+ ${summary.totalAtk}% ATK`);
                if (summary.totalDef > 0) parts.push(`+ ${summary.totalDef}% DEF`);
                if (summary.totalHp > 0) parts.push(`+ ${summary.totalHp}% HP`);
                if (summary.totalBbFill > 0) parts.push(`+ ${summary.totalBbFill}% BB`);

                if (parts.length > 0) {
                    summaryPanel.style.display = 'block';
                    summaryText.textContent = parts.join(', ');
                } else {
                    summaryPanel.style.display = 'none';
                }
            }
        }
    }

    renderPartySlots() {
        // Update bonuses alongside party slots
        this.updateTeamBonuses();

        const partyContainer = document.getElementById('party-units');
        if (!partyContainer) return;

        partyContainer.innerHTML = '';
        const party = this.game.partyManager.getParty();
        const maxPartySize = 5;

        // Render 5 slots (filled or empty)
        for (let i = 0; i < maxPartySize; i++) {
            const unit = party[i];
            const slotEl = document.createElement('div');
            slotEl.className = 'party-slot-horizontal';

            if (unit) {
                // Filled slot
                slotEl.classList.add('filled');
                slotEl.classList.add(`rarity - ${unit.rarity || 1} `);
                const colors = {
                    'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
                    'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
                };

                slotEl.innerHTML = `
            <div class="hero-avatar-container" style = "background-color: ${colors[unit.element] || colors['none']};">
                <span style="font-size: 2em;">👤</span>
                    </div>
                    <div class="hero-name">${unit.name}</div>
                    <div class="hero-level">Niv. ${unit.level}</div>
                    <div class="hero-stars">${unit.getRarityStars()}</div>
                    <button class="remove-btn" title="Retirer">✖</button>
        `;

                // Remove button handler
                const removeBtn = slotEl.querySelector('.remove-btn');
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.game.partyManager.removeFromParty(unit);
                    this.updateEquipmentScreen();
                };

                // Click to view details
                slotEl.onclick = () => {
                    console.log('Selected unit:', unit.name);
                };

            } else {
                // Empty slot
                slotEl.classList.add('empty');
                slotEl.innerHTML = `
            <div style = "font-size: 2em; opacity: 0.3;"> +</div>
                <div class="hero-name" style="color: #666;">Vide</div>
        `;
            }

            partyContainer.appendChild(slotEl);
        }

        // Update Party Count in Header
        const currentCount = party.filter(u => u !== null).length;
        const countSpan = document.getElementById('party-count');
        if (countSpan) {
            countSpan.textContent = `(${currentCount} / ${maxPartySize})`;
        }
    }


    renderAvailableHeroes() {
        const gridContainer = document.getElementById('equipment-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';
        const allUnits = this.game.partyManager.getAllUnits();
        const party = this.game.partyManager.getParty();

        // Get Filters
        const filterElement = document.getElementById('filter-element');
        const filterRole = document.getElementById('filter-role');
        const selectedElement = filterElement ? filterElement.value : 'all';
        const selectedRole = filterRole ? filterRole.value : 'all';

        // Filter units
        const availableUnits = allUnits.filter(u => {
            if (party.includes(u)) return false; // Already in party
            if (selectedElement !== 'all' && u.element !== selectedElement) return false;
            if (selectedRole !== 'all' && u.class !== selectedRole) return false;
            return true;
        });

        if (availableUnits.length === 0) {
            gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #aaa; padding: 20px;">Aucun autre héros disponible</div>';
            return;
        }

        availableUnits.forEach((unit, index) => {
            // TEMP: Force rarity 7 for the first unit for verification
            // if (index === 0) unit.rarity = 7;

            const unitCard = document.createElement('div');
            unitCard.className = `hero - card - compact rarity - ${unit.rarity || 1} `;
            // DEBUG: Force visible styles
            unitCard.style.cssText = `
        min - height: 120px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #555;
        border - radius: 8px;
        padding: 5px;
        display: flex;
        flex - direction: column;
        align - items: center;
        justify - content: center;
        cursor: pointer;
        `;

            const colors = {
                'fire': '#e74c3c', 'water': '#3498db', 'earth': '#27ae60',
                'thunder': '#f39c12', 'light': '#ecf0f1', 'dark': '#34495e', 'none': '#95a5a6'
            };

            unitCard.innerHTML = `
            <div class="hero-avatar" style = "background-color: ${colors[unit.element] || colors['none']}"></div>
                <div class="hero-name">${unit.name}</div>
                <div class="hero-level">Niv. ${unit.level}</div>
                <div class="hero-stars">${unit.getRarityStars()}</div>
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

    // renderTeamBonuses - REMOVED

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
            <div class="char-name"> ${unit.name}</div>
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
            ? `<button id = "btn-evolve-unit" class="btn-evolve" style = "margin-top: 16px; width: 100%;">🌟 Évoluer(${unit.getRarityStars()} → ${'★'.repeat(unit.currentRarity + 1)})</button> `
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
            const slotEl = document.getElementById(`slot - ${slot} `);
            const unequipBtn = document.querySelector(`.btn - unequip[data - slot="${slot}"]`);

            if (equipment[slot]) {
                const statsStr = this.getItemStatsString(equipment[slot]);
                const iconPath = AssetManager.getItemIconPath(equipment[slot]);
                slotEl.innerHTML = `
                    <div class="equipped-name">${equipment[slot].name}</div>
                    <img src="${iconPath}" class="equipped-icon" style="width: 40px; height: 40px; object-fit: contain; display: block; margin: 5px auto;">
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
            const iconPath = AssetManager.getItemIconPath(item);
            itemCard.innerHTML = `
                <img src="${iconPath}" class="item-icon" style="width: 32px; height: 32px; object-fit: contain; margin-right: 10px;">
                <div class="item-details" style="flex: 1;">
                    <div class="item-name">${item.name}</div>
                    <div class="item-desc">${statsStr}</div>
                    <div class="item-type">${item.type}</div>
                </div>
            `;
            // Ensure flex layout for the card if not already in CSS
            itemCard.style.display = 'flex';
            itemCard.style.alignItems = 'center';

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
        if (item.stats.atk) stats.push(`ATK + ${item.stats.atk} `);
        if (item.stats.def) stats.push(`DEF + ${item.stats.def} `);
        if (item.stats.maxHp) stats.push(`HP + ${item.stats.maxHp} `);
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
            <div >
                    <h3>${quest.name}</h3>
                    <p>${quest.description}</p>
                </div>
            <button>Commencer (${quest.energyCost} Énergie)</button>
        `;

            el.querySelector('button').addEventListener('click', () => {
                console.log(`Clic sur commencer la quête: ${quest.name} `);
                this.game.startBattle();
                this.game.questSystem.startQuest(quest.id);
            });

            list.appendChild(el);
        });
    }

    bindEvents() {
        // Main Menu Card Navigation


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

        // Village Events
        const cardVillage = document.getElementById('card-village');
        if (cardVillage) {
            cardVillage.addEventListener('click', () => {
                this.openVillageScreen();
            });
        }

        // PVP Events
        const cardPvp = document.getElementById('card-pvp');
        if (cardPvp) {
            cardPvp.addEventListener('click', () => {
                this.openGuildScreen(); // Réutilise l'écran Guild pour le PVP
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


        const btnVillageExit = document.getElementById('btn-village-exit');
        if (btnVillageExit) {
            btnVillageExit.addEventListener('click', () => {
                this.showScreen(this.screens.MAIN_MENU);
            });
        }

        // Crafting Events
        const cardCrafting = document.getElementById('card-crafting');
        if (cardCrafting) {
            cardCrafting.addEventListener('click', () => {
                this.openCraftingScreen();
            });
        }

        const btnCraftingExit = document.getElementById('btn-crafting-exit');
        if (btnCraftingExit) {
            btnCraftingExit.addEventListener('click', () => {
                this.showScreen(this.screens.MAIN_MENU);
            });
        }

        // Story Mode Events
        const cardStory = document.getElementById('card-story');
        if (cardStory) {
            cardStory.addEventListener('click', () => {
                this.openStoryScreen();
            });
        }

        const btnStoryBack = document.getElementById('btn-story-back');
        if (btnStoryBack) {
            btnStoryBack.addEventListener('click', () => {
                // If in stage selection, go back to zone selection
                const zoneSelection = document.getElementById('zone-selection');
                const stageSelection = document.getElementById('stage-selection');

                if (stageSelection && stageSelection.style.display !== 'none') {
                    // Currently in stage selection, go back to zone selection
                    this.updateStoryScreen();
                } else {
                    // Currently in zone selection, go back to main menu
                    this.showScreen(this.screens.MAIN_MENU);
                }
            });
        }
    }


    showScreen(screenId) {
        // Redirection de sûreté: MAIN_MENU est le VILLAGE
        if (screenId === this.screens.MAIN_MENU) {
            screenId = this.screens.VILLAGE;
        }

        // Remove any open building modals
        const existingModals = document.querySelectorAll('.building-detail-modal');
        existingModals.forEach(modal => modal.remove());

        // Remove any open shop modals
        const shopModals = document.querySelectorAll('.shop-modal');
        shopModals.forEach(modal => modal.remove());

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
            this.updateVillageVisuals();
        } else if (screenId === this.screens.VILLAGE) {
            this.updateVillageVisuals();
            this.updateBuildingsGrid();
        } else if (screenId === this.screens.FORMATION) {
            this.formationManager.renderFormationScreen();
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
            0 % { opacity: 1; transform: scale(1); }
            80 % { opacity: 1; transform: scale(1.1); }
            100 % { opacity: 0; transform: scale(1.2); }
        }
        `;
            document.head.appendChild(style);
        }

        this.uiLayer.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }

    showStartBattleControls(show) {
        let btn = document.getElementById('btn-start-battle');
        let timer = document.getElementById('battle-timer');

        if (!btn) {
            // Create controls if missing
            const container = document.createElement('div');
            container.id = 'start-battle-container';
            container.style.cssText = 'position: absolute; top: 100px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 100;';

            timer = document.createElement('div');
            timer.id = 'battle-timer';
            timer.style.cssText = 'color: white; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px black;';
            timer.textContent = '15s';

            btn = document.createElement('button');
            btn.id = 'btn-start-battle';
            btn.textContent = 'LANCER LE COMBAT';
            btn.style.cssText = 'background: #e74c3c; color: white; border: 2px solid white; padding: 10px 20px; font-size: 20px; font-weight: bold; cursor: pointer; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);';

            btn.addEventListener('click', () => {
                this.game.battleSystem.startCombat();
            });

            container.appendChild(timer);
            container.appendChild(btn);
            this.uiLayer.appendChild(container);
        }

        const container = document.getElementById('start-battle-container');
        if (container) {
            container.style.display = show ? 'flex' : 'none';
        }
    }

    updateSetupTimer(seconds) {
        const timer = document.getElementById('battle-timer');
        if (timer) {
            timer.textContent = `Début dans ${seconds} s`;
            if (seconds <= 5) {
                timer.style.color = '#e74c3c';
                timer.style.transform = 'scale(1.2)';
            } else {
                timer.style.color = 'white';
                timer.style.transform = 'scale(1)';
            }
        }
    }

    showFloatingText(x, y, text, color) {
        const el = document.createElement('div');
        el.textContent = text;
        el.style.cssText = `position: absolute; left: ${x} px; top: ${y - 30} px; color: ${color}; font - weight: bold; font - size: 16px; text - shadow: 1px 1px 2px black; pointer - events: none; animation: floatUp 1s ease - out forwards; `;
        this.uiLayer.appendChild(el);
        setTimeout(() => el.remove(), 1000);
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
            <p >✓ 2 Duplicatas disponibles</p>
                `;

            // Show cost
            costDiv.innerHTML = `
                <p >💰 Coût: ${check.cost.toLocaleString()} Or</p>
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
        console.log(`Héros sélectionné: ${unit.name} `);
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
                slotEl.title = `${item.name} (Niv.${item.level || 1}) - Cliquez pour déséquiper`;
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

        const activeTab = document.querySelector('.tab-btn.active');
        const currentTab = activeTab ? activeTab.dataset.tab : 'all';
        this.updateInventoryGrid(currentTab);
        this.renderInventoryPartyUnits();
    }

    updateInventoryGrid(filterType) {
        const grid = document.getElementById('rpg-inventory-grid');
        if (!grid) return;

        grid.innerHTML = '';
        let items = this.game.economySystem.inventory;

        let filteredItems = items;
        if (filterType !== 'all') {
            if (filterType === 'armor') {
                filteredItems = items.filter(item =>
                    item.type === 'armor' ||
                    item.type === 'plate' ||
                    item.type === 'leather' ||
                    item.type === 'cloth' ||
                    item.type === 'helm' ||
                    item.type === 'boots'
                );
            } else {
                filteredItems = items.filter(item => item.type === filterType);
            }
        }

        if (filteredItems.length === 0) {
            grid.innerHTML = '<div class="empty-inventory">Aucun objet trouvé</div>';
            return;
        }

        filteredItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'rpg-item-card';

            const iconPath = AssetManager.getItemIconPath(item);

            itemCard.innerHTML = `
                <img src="${iconPath}" class="rpg-item-icon-img" style="width: 48px; height: 48px; object-fit: contain; margin-bottom: 5px;">
                <div class="rpg-item-level">Niv.${item.level || 1}</div>
            `;

            // Add tooltip
            itemCard.title = `${item.name} \n${item.type.toUpperCase()} \n${this.getItemStatsString(item)} \n${item.description || ''} `;

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
            <div class="char-name"> ${dup.name}</div>
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
            alert(`Félicitations! ${unit.name} a évolué!`);
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

    updateBlacksmithScreen(filter = 'all', mode = 'upgrade') {
        const container = document.getElementById('tab-blacksmith');
        if (!container) return;

        // Ensure Tabs Structure exists
        if (!document.getElementById('blacksmith-mode-tabs')) {
            container.innerHTML = `
            <div class="guild-header">
                    <h2>Forgeron</h2>
                    <div id="blacksmith-gold-amount" class="resource-badge">0 Or</div>
                </div>
                
                <div id="blacksmith-mode-tabs" class="sub-tabs">
                    <button class="sub-tab-btn active" data-mode="upgrade">Améliorer</button>
                    <button class="sub-tab-btn" data-mode="craft">Forger</button>
                </div>

                <div id="blacksmith-content-upgrade" class="blacksmith-mode-content">
                     <!-- Existing Inventory Grid -->
                     <div class="inventory-filters">
                        <button class="filter-btn active" onclick="uiManager.updateBlacksmithScreen('all', 'upgrade')">Tout</button>
                        <button class="filter-btn" onclick="uiManager.updateBlacksmithScreen('weapon', 'upgrade')">Armes</button>
                        <button class="filter-btn" onclick="uiManager.updateBlacksmithScreen('armor', 'upgrade')">Armures</button>
                        <button class="filter-btn" onclick="uiManager.updateBlacksmithScreen('accessory', 'upgrade')">Bijoux</button>
                     </div>
                     <div class="blacksmith-layout">
                        <div id="blacksmith-items" class="items-grid"></div>
                        <div id="blacksmith-panel" class="upgrade-panel">
                             <div id="blacksmith-preview">Select an item</div>
                             <div id="blacksmith-materials" style="display:none">
                                <p>Matériel requis</p>
                                <div id="blacksmith-material-slot"></div>
                             </div>
                             <div id="blacksmith-cost"></div>
                             <button id="btn-upgrade" class="btn-action" disabled>Améliorer</button>
                        </div>
                     </div>
                </div>

                <div id="blacksmith-content-craft" class="blacksmith-mode-content" style="display:none">
                    <h3>Forger un nouvel équipement</h3>
                    <div class="crafting-controls">
                        <label>Type d'objet :</label>
                        <select id="craft-slot-select">
                            <option value="">Aléatoire</option>
                            <option value="weapon">Arme</option>
                            <option value="armor">Armure</option>
                            <option value="helm">Casque</option>
                            <option value="boots">Bottes</option>
                            <option value="accessory">Accessoire</option>
                        </select>
                        
                        <label>Rareté Cible :</label>
                        <select id="craft-rarity-select">
                            <option value="1">1 Etoile (Standard)</option>
                            <option value="2">2 Etoiles (Rare)</option>
                            <option value="3">3 Etoiles (Epic)</option>
                        </select>
                        
                        <div id="craft-cost-preview" style="margin: 20px 0; font-weight: bold;">
                             Coût: 100 Or, 10 Cristaux
                        </div>

                        <button id="btn-craft-action" class="btn-action">FORGER (Aléatoire)</button>
                    </div>
                </div>
        `;

            // Bind Tab Clicks
            container.querySelectorAll('.sub-tab-btn').forEach(btn => {
                btn.onclick = () => {
                    const newMode = btn.dataset.mode;
                    this.updateBlacksmithScreen(filter, newMode);
                };
            });

            // Bind Craft Button
            const craftBtn = document.getElementById('btn-craft-action');
            if (craftBtn) {
                craftBtn.onclick = () => {
                    const slot = document.getElementById('craft-slot-select').value || null;
                    const rarity = parseInt(document.getElementById('craft-rarity-select').value);
                    this.game.craftingSystem.craftNewItem(slot, rarity);
                };
            }

            // Update Cost Preview on Change
            const updateCost = () => {
                const rarity = parseInt(document.getElementById('craft-rarity-select').value);
                const gold = 100 * rarity;
                const crystals = 10 * rarity;
                document.getElementById('craft-cost-preview').textContent = `Coût: ${gold} Or, ${crystals} Cristaux`;
            };
            document.getElementById('craft-rarity-select').onchange = updateCost;
        }

        // Toggle Views based on Mode
        document.querySelectorAll('.sub-tab-btn').forEach(btn => {
            if (btn.dataset.mode === mode) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        document.getElementById('blacksmith-content-upgrade').style.display = mode === 'upgrade' ? 'block' : 'none';
        document.getElementById('blacksmith-content-craft').style.display = mode === 'craft' ? 'block' : 'none';

        if (mode === 'craft') return; // Stop here if crafting mode

        // UPGRADE MODE LOGIC (Original Code)
        const list = document.getElementById('blacksmith-items');
        if (!list) return; // Should allow re-render of list if upgrading

        let items = this.game.economySystem.inventory;


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

            // Icon based on type - Now using Assets
            const iconPath = AssetManager.getItemIconPath(item);

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
                <div class="item-icon">
                    <img src="${iconPath}" style="width: 40px; height: 40px; object-fit: contain;">
                </div>
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
                ? `+ ${Math.floor(bonus.value * 100)}% `
                : `+ ${bonus.value} `;

            statsHtml += `<div > ${key.toUpperCase()}: ${item.stats[key]} → <span class="stat-boost">${nextStats[key]}</span> <span class="bonus-indicator">(${bonusText})</span></div> `;
        }

        const tierBadge = isTierUp
            ? `<span class="tier-up-badge">🌟 PALIER ${nextTier} 🌟</span> `
            : '';

        previewEl.innerHTML = `
            <h3 > ${item.name} +${item.level} → +${item.level + 1}</h3>
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
                materialSlot.innerHTML = `<p class="error-text"> Aucun doublon + ${item.level} trouvé</p> `;
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
                    statsHtml += `<div > ${key.toUpperCase()}: +${itemData.stats[key]}</div> `;
                }

                el.innerHTML = `
            <div class="item-name"> ${itemData.name}</div>
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
                statsHtml += `<div > ${key.toUpperCase()}: +${item.stats[key]}</div> `;
            }

            const levelText = item.level > 0 ? ` + ${item.level} ` : '';
            const sellPrice = item.level > 0 ? item.level * 50 : 10; // Base price 10 for level 0, 50 per level
            el.innerHTML = `
            <div class="item-name"> ${item.name}${levelText}</div>
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
                statsHtml += `<div > ${key.toUpperCase()}: +${itemData.stats[key]}</div> `;
            }

            el.innerHTML = `
            <div class="item-name"> ${itemData.name}</div>
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

            console.log(`Acheté: ${itemData.name} `);
            this.showShopModal(`${itemData.name} acheté!`, 'success');
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
            `Vendre ${item.name}${item.level > 0 ? ' +' + item.level : ''} pour ${sellPrice} Or ? `,
            () => {
                // Remove from inventory
                this.game.economySystem.inventory.splice(index, 1);

                // Add gold
                this.game.economySystem.resources.gold += sellPrice;

                // Update UI
                this.updateResourceDisplay();
                this.updateShopScreen();

                console.log(`Vendu: ${item.name} pour ${sellPrice} Or`);
                this.showShopModal(`${item.name} vendu pour ${sellPrice} Or!`, 'success');
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
            this.bindAuthEvents(authScreen);
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

                <!--Error / Success Messages-->
                <div class="auth-error" id="auth-error"></div>
                <div class="auth-success" id="auth-success"></div>

                <!--Login Form-->
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

                <!--Register Form-- >
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
                authScreen.querySelector(`#${targetTab} -form`).classList.add('active');

                // Clear messages
                this.hideAuthMessage();
            });
        });

        // Login form
        const loginForm = authScreen.querySelector('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }

        // Register form
        const registerForm = authScreen.querySelector('#register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }

        // Guest button
        const guestBtn = authScreen.querySelector('#btn-guest');
        if (guestBtn) {
            guestBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showScreen(this.screens.VILLAGE);
            });
        }
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
                    this.showScreen(this.screens.VILLAGE);
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
                    this.showScreen(this.screens.VILLAGE);
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

    // ==================== VILLAGE METHODS ====================

    /**
     * Shows notification message
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(46, 204, 113, 0.9);
        color: white;
        padding: 15px 25px;
        border - radius: 10px;
        font - weight: bold;
        z - index: 10000;
        animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Opens the village screen
     */
    openVillageScreen() {
        this.showScreen('village-screen');
        this.updateVillageScreen();
    }

    /**
     * Updates the visual appearance of the village based on its Tier
     */
    updateVillageVisuals() {
        if (!this.game.villageSystem || !this.game.villageSystem.buildings.town_hall) return;

        const townHallLevel = this.game.villageSystem.buildings.town_hall.level || 1;
        const bgContainer = document.getElementById('village-background');

        let bgImage;
        // Logic for Ruined Village (Level 1 starts as ruins)
        if (townHallLevel <= 1) {
            bgImage = `url("assets/backgrounds/village_ruins_bg.png")`;
        } else {
            // We have assets: village_bg_lvl_1.png to village_bg_lvl_7.png
            // Clamp level between 1 and 7
            const bgLevel = Math.max(1, Math.min(townHallLevel, 7));
            bgImage = `url("assets/backgrounds/village_bg_lvl_${bgLevel}.png")`;
        }

        if (bgContainer) {
            bgContainer.style.backgroundImage = bgImage;
            bgContainer.style.backgroundSize = 'cover';
            bgContainer.style.backgroundPosition = 'center';
            bgContainer.style.width = '100%';
            bgContainer.style.height = '100%';
        }
    }
    /**
     * Updates the village screen
     */
    updateVillageScreen() {
        const screen = document.getElementById('village-screen');
        if (!screen) return;

        // Update resources display
        this.updateVillageResources();

        // Update buildings grid
        this.updateBuildingsGrid();

        // Update visuals
        this.updateVillageVisuals();
    }

    /**
     * Updates village resources display
     */
    updateVillageResources() {
        const container = document.querySelector('.village-resources-container');
        if (!container) return;

        const resources = this.game.economySystem.resources;

        container.innerHTML = `
            <div class="resource-display">
                <span class="resource-icon">💰</span>
                <span class="resource-label">Or</span>
                <span class="resource-amount">${resources.gold.toLocaleString()}</span>
            </div>
            <div class="resource-display">
                <span class="resource-icon">💎</span>
                <span class="resource-label">Cristaux</span>
                <span class="resource-amount">${resources.crystals.toLocaleString()}</span>
            </div>
            <div class="resource-display">
                <span class="resource-icon">⚗️</span>
                <span class="resource-label">Essences</span>
                <span class="resource-amount">${resources.essences.toLocaleString()}</span>
            </div>
            <div class="resource-display">
                <span class="resource-icon">🔮</span>
                <span class="resource-label">Fragments</span>
                <span class="resource-amount">${resources.fragments.toLocaleString()}</span>
            </div>
        `;
    }

    async updateBuildingsGrid() {
        const bgContainer = document.getElementById('village-background');
        if (!bgContainer) return;

        // Ensure relative positioning
        if (getComputedStyle(bgContainer).position === 'static') {
            bgContainer.style.position = 'relative';
        }

        // Clear previous content (except bg image style)
        bgContainer.innerHTML = '';

        // Hide Legacy Header if presents
        const legacyHeader = document.querySelector('.village-header');
        if (legacyHeader) legacyHeader.style.display = 'none';

        // Add Tier Label overlay (persists visual tier name)
        const tierLabel = document.createElement('div');
        tierLabel.id = 'village-tier-label';
        tierLabel.style.position = 'absolute';
        tierLabel.style.top = '10px';
        tierLabel.style.left = '10px';
        tierLabel.style.color = 'rgba(255,255,255,0.7)';
        tierLabel.style.fontSize = '0.8em';
        tierLabel.style.zIndex = '100';
        bgContainer.appendChild(tierLabel);

        // Building positions (Approximate) adjusted for visibility
        // x, y are percentages. w is width percentage.
        const buildingPositions = {
            'town_hall': { x: 40, y: 30, w: 25, z: 10 },
            'sanctuary': { x: 70, y: 50, w: 20, z: 15 },
            'forgeron': { x: 10, y: 55, w: 20, z: 15 },
            'market': { x: 25, y: 70, w: 18, z: 20 },  // Marché
            'market_shop': { x: 25, y: 70, w: 18, z: 20 }, // Fallback
            'crystal_mine': { x: 80, y: 30, w: 15, z: 5 },
            'alchemy_lab': { x: 60, y: 70, w: 15, z: 20 },
            'portal': { x: 5, y: 30, w: 15, z: 5 },
            'warehouse': { x: 85, y: 70, w: 15, z: 20 },
            'guild': { x: 50, y: 15, w: 15, z: 5 }, // Guild Hall background?
            'arena': { x: 10, y: 10, w: 15, z: 2 }
        };

        // Mapping for Ruined Assets (Filename in assets/buildings/ruins/)
        const ruinedMapping = {
            'town_hall': 'town_hall.png',
            'forgeron': 'forge.png',
            'sanctuary': 'sanctuary.png',
            'market': 'shop.png',
            'market_shop': 'shop.png',
            'crystal_mine': 'crystal_mine.png',
            'alchemy_lab': 'alchemy_lab.png',
            'warehouse': 'warehouse.png',
            'guild': 'guild.png',
            'arena': 'arena.png'
        };

        const buildingIds = getAllBuildingIds();
        // Check if map contains buildings not in DB but requested
        if (!buildingIds.includes('guild')) buildingIds.push('guild');

        buildingIds.forEach(buildingId => {
            const pos = buildingPositions[buildingId];
            if (!pos) return;

            // Handle case where building might not be in system but we want to show it (e.g. ruins)
            let buildingState = this.game.villageSystem.buildings[buildingId];
            // Initializing fake state if missing, for visual purposes of ruins
            if (!buildingState) {
                buildingState = { level: 0 };
            }

            const buildingData = BUILDING_DATABASE[buildingId] || { name: 'Bâtiment', benefits: {} };

            let visualLevel = buildingState.level;
            if (visualLevel < 1) visualLevel = 1;
            if (visualLevel > 7) visualLevel = 7;

            // Determine Image URL
            let bgUrl = `assets/buildings/${buildingId}/${buildingId}_lvl${visualLevel}.png`;

            // Ruined Logic
            const townHallLevel = this.game.villageSystem.buildings['town_hall'] ? this.game.villageSystem.buildings['town_hall'].level : 1;
            const isRuined = townHallLevel <= 1;

            if (isRuined && ruinedMapping[buildingId]) {
                bgUrl = `assets/buildings/ruins/${ruinedMapping[buildingId]}`;
            }

            const sprite = document.createElement('div');
            sprite.className = `building-sprite building-${buildingId}`;
            sprite.style.backgroundImage = `url('${bgUrl}')`;
            sprite.style.position = 'absolute';
            sprite.style.left = `${pos.x}%`;
            sprite.style.top = `${pos.y}%`;
            sprite.style.width = `${pos.w}%`;
            sprite.style.zIndex = pos.z;
            sprite.style.aspectRatio = '1 / 1';
            sprite.style.backgroundSize = 'contain';
            sprite.style.backgroundRepeat = 'no-repeat';
            sprite.style.cursor = 'pointer';

            if (buildingState.level === 0 && !isRuined) {
                sprite.style.filter = 'grayscale(100%) opacity(0.7)';
            }

            // Hover
            sprite.style.transition = 'transform 0.2s, filter 0.2s';
            sprite.onmouseenter = () => {
                sprite.style.transform = 'scale(1.1)';
                sprite.style.filter = (buildingState.level === 0 && !isRuined) ? 'grayscale(80%) brightness(1.2)' : 'brightness(1.2)';
            };
            sprite.onmouseleave = () => {
                sprite.style.transform = 'scale(1)';
                sprite.style.filter = (buildingState.level === 0 && !isRuined) ? 'grayscale(100%) opacity(0.7)' : 'none';
            };

            // Label
            const label = document.createElement('div');
            // Show "Ruines" if ruined
            const levelText = isRuined ? 'Ruines' : `Lv.${buildingState.level}`;
            label.innerHTML = `<div style="text-shadow:0 1px 2px black; font-weight:bold;">${buildingData.name}</div><div style="font-size:0.8em;color:#ffd700;text-shadow:0 1px 2px black;">${levelText}</div>`;
            label.style.position = 'absolute';
            label.style.bottom = '-30px';
            label.style.left = '50%';
            label.style.transform = 'translateX(-50%)';
            label.style.textAlign = 'center';
            label.style.width = '150px';
            label.style.color = 'white';
            label.style.pointerEvents = 'none';
            sprite.appendChild(label);

            // Collection Bubble
            if (buildingData.benefits.type === 'production' && buildingState.level > 0 && !isRuined) {
                const generated = this.game.villageSystem.calculateGeneratedResources(buildingId);
                if (generated > 0) {
                    const resourceIcon = buildingData.benefits.resource === 'crystals' ? '💎' :
                        buildingData.benefits.resource === 'essences' ? '⚗️' : '💰';

                    const bubble = document.createElement('div');
                    bubble.className = 'collection-bubble';
                    bubble.innerHTML = `${resourceIcon}`;
                    bubble.style.position = 'absolute';
                    bubble.style.top = '-15px';
                    bubble.style.right = '-15px';
                    bubble.style.background = '#fff';
                    bubble.style.border = '2px solid #f1c40f';
                    bubble.style.borderRadius = '50%';
                    bubble.style.width = '30px';
                    bubble.style.height = '30px';
                    bubble.style.display = 'flex';
                    bubble.style.justifyContent = 'center';
                    bubble.style.alignItems = 'center';
                    bubble.style.cursor = 'pointer';
                    bubble.style.zIndex = '50';
                    bubble.style.animation = 'bounce 2s infinite';
                    bubble.style.boxShadow = '0 0 10px rgba(241, 196, 15, 0.5)';

                    bubble.onclick = (e) => {
                        e.stopPropagation();
                        this.collectBuildingResources(buildingId);
                    };

                    sprite.appendChild(bubble);
                }
            }

            sprite.onclick = (e) => {
                e.stopPropagation();
                if (buildingState.level > 0) {
                    if (buildingId === 'sanctuary') { this.openGuildScreen(); this.updateGuildScreen('summon'); }
                    else if (buildingId === 'forgeron') { this.openGuildScreen(); this.updateBlacksmithScreen('all', 'craft'); }
                    else if (buildingId === 'market_shop' || buildingId === 'market') { this.openGuildScreen(); this.updateShopScreen(); }
                    else this.openBuildingDetail(buildingId);
                } else this.openBuildingDetail(buildingId);
            };

            bgContainer.appendChild(sprite);
        });

        // Hide Old Grid
        const oldGrid = document.querySelector('#village-screen .buildings-grid');
        if (oldGrid) oldGrid.style.display = 'none';
    }

    async collectBuildingResources(buildingId) {
        const amount = this.game.villageSystem.collectResources(buildingId);
        if (amount > 0) {
            const { BUILDING_DATABASE } = await import('../data/BuildingDatabase.js');
            const buildingData = BUILDING_DATABASE[buildingId];
            const resourceName = buildingData.benefits.resource;
            this.showNotification(`+ ${amount} ${resourceName} collectés!`);
            this.updateVillageScreen();
        }
    }

    /**
     * Opens building detail modal
     */
    async openBuildingDetail(buildingId) {
        const { BUILDING_DATABASE, getUpgradeCost, getUpgradeTime, getProduction, getCapacity } = await import('../data/BuildingDatabase.js');
        const buildingData = BUILDING_DATABASE[buildingId];
        const buildingState = this.game.villageSystem.buildings[buildingId];

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'building-detail-modal';
        modal.style.display = 'block';

        const cost = getUpgradeCost(buildingId, buildingState.level);
        const upgradeTime = getUpgradeTime(buildingId, buildingState.level);
        const canUpgrade = this.game.villageSystem.canUpgradeBuilding(buildingId);

        // Build stats HTML
        let statsHtml = '';
        if (buildingData.benefits.type === 'production') {
            const currentProd = getProduction(buildingId, buildingState.level);
            const nextProd = getProduction(buildingId, buildingState.level + 1);
            const currentCap = getCapacity(buildingId, buildingState.level);
            const nextCap = getCapacity(buildingId, buildingState.level + 1);

            statsHtml = `
            <div class="stat-row">
    <span class="stat-label">Production/h</span>
    <span class="stat-value">${currentProd} → ${nextProd}</span>
</div>
            <div class="stat-row">
                <span class="stat-label">Capacité</span>
                <span class="stat-value">${currentCap} → ${nextCap}</span>
            </div>
        `;
        }

        // Build cost HTML
        let costHtml = '';
        const resources = this.game.economySystem.resources;
        if (buildingState.level < buildingData.maxLevel) {
            costHtml = `
            <div class="upgrade-cost">
    <div class="cost-title">Coût d'amélioration</div>
    <div class="cost-item ${resources.gold >= cost.gold ? '' : 'insufficient'}">
        💰 Or: ${cost.gold.toLocaleString()}
    </div>
    ${cost.crystals > 0 ? `<div class="cost-item ${resources.crystals >= cost.crystals ? '' : 'insufficient'}">
        💎 Cristaux: ${cost.crystals.toLocaleString()}
    </div>` : ''
                }
    ${cost.essences > 0 ? `<div class="cost-item ${resources.essences >= cost.essences ? '' : 'insufficient'}">
        ⚗️ Essences: ${cost.essences.toLocaleString()}
    </div>` : ''
                }
        <div class="cost-item">
            ⏱️ Temps: ${this.formatTime(upgradeTime)}
        </div>
</div>
            `;
        }

        modal.innerHTML = `
            <div class="modal-header">
    <div class="modal-title">
        <span>${buildingData.icon}</span>
        ${buildingData.name}
    </div>
    <button class="modal-close">✖</button>
</div>
<div class="building-description">${buildingData.description}</div>
<div class="building-stats">
    <div class="stat-row">
        <span class="stat-label">Niveau actuel</span>
        <span class="stat-value">${buildingState.level}/${buildingData.maxLevel}</span>
    </div>
    ${statsHtml}
</div>
${costHtml}
${buildingState.level < buildingData.maxLevel ? `
    <button class="upgrade-button" ${!canUpgrade ? 'disabled' : ''}>
        ${buildingState.isUpgrading ? 'En cours...' : 'Améliorer'}
    </button>
` : '<p style="text-align: center; color: #ffd700;">✨ Niveau maximum atteint !</p>'
            }

${this.getBuildingActionButtons(buildingId)}
        `;

        document.body.appendChild(modal);

        // Event handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => modal.remove();

        const upgradeBtn = modal.querySelector('.upgrade-button');
        if (upgradeBtn && !upgradeBtn.disabled) {
            upgradeBtn.onclick = () => {
                if (this.game.villageSystem.upgradeBuilding(buildingId)) {
                    this.showNotification(`${buildingData.name} amélioration démarrée!`);
                    modal.remove();
                    this.updateVillageScreen();
                }
            };
        }

        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    getBuildingActionButtons(buildingId) {
        if (buildingId === 'sanctuary') {
            return `<button class="btn-enter-building" style = "margin-top: 10px; width: 100%; padding: 10px; background: #9b59b6; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;"> Entrer dans le Sanctuaire</button> `;
        }
        if (buildingId === 'forgeron') {
            return `<button class="btn-enter-building" style = "margin-top: 10px; width: 100%; padding: 10px; background: #e67e22; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;"> Entrer dans la Forge</button> `;
        }
        if (buildingId === 'market_shop') {
            return `<button class="btn-enter-building" style = "margin-top: 10px; width: 100%; padding: 10px; background: #27ae60; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;"> Entrer dans le Marché</button> `;
        }
        return '';
    }

    /**
     * Opens the crafting screen
     */
    openCraftingScreen() {
        this.showScreen('crafting-screen');
        this.updateCraftingScreen();
    }

    /**
     * Updates the crafting screen
     */
    updateCraftingScreen() {
        this.updateCraftingItemList();
        this.updateCraftingPanel();
    }

    /**
     * Updates the item list for crafting
     */
    updateCraftingItemList() {
        const list = document.querySelector('.item-list');
        if (!list) return;

        const items = this.game.economySystem.inventory.filter(item =>
            item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory'
        );

        list.innerHTML = '<h3>Objets à raffiner</h3>';

        if (items.length === 0) {
            list.innerHTML += '<p style="color: #95a5a6; text-align: center; margin-top: 20px;">Aucun objet dans l\'inventaire</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            if (this.selectedCraftItem === item) {
                card.classList.add('selected');
            }

            let statsHtml = '';
            for (let stat in item.stats) {
                statsHtml += `<span > ${stat.toUpperCase()}: ${item.stats[stat]}</span> `;
            }

            card.innerHTML = `
            <div class="item-header">
                    <div class="item-name">${item.name}</div>
                    <div class="item-stars">${item.getStarDisplay()}</div>
                </div>
            <div class="item-stats">${statsHtml}</div>
        `;

            card.onclick = () => {
                this.selectedCraftItem = item;
                this.updateCraftingScreen();
            };

            list.appendChild(card);
        });
    }

    /**
     * Updates the crafting panel
     */
    async updateCraftingPanel() {
        const panel = document.querySelector('.refine-panel');
        if (!panel) return;

        if (!this.selectedCraftItem) {
            panel.innerHTML = '<p style="color: #95a5a6; text-align: center; margin-top: 50px;">Sélectionnez un objet à raffiner</p>';
            return;
        }

        const item = this.selectedCraftItem;
        const refineInfo = this.game.craftingSystem.getRefineInfo(item);

        if (!refineInfo) {
            panel.innerHTML = '<p style="color: #e74c3c;">Erreur lors du chargement des informations</p>';
            return;
        }

        // Current and new stats
        let currentStatsHtml = '';
        let newStatsHtml = '';
        for (let stat in item.stats) {
            currentStatsHtml += `<div > ${stat.toUpperCase()}: ${item.stats[stat]}</div> `;
            if (refineInfo.newStats) {
                newStatsHtml += `<div > ${stat.toUpperCase()}: ${refineInfo.newStats[stat]}</div> `;
            }
        }

        // Requirements
        let reqHtml = '';
        if (refineInfo.cost) {
            const resources = this.game.economySystem.resources;
            reqHtml = `
            <div class="refine-requirements">
                    <h4>Ressources requises</h4>
                    <div class="cost-item ${resources.gold >= refineInfo.cost.gold ? '' : 'insufficient'}">
                        💰 Or: ${refineInfo.cost.gold.toLocaleString()}
                    </div>
                    <div class="cost-item ${resources.crystals >= refineInfo.cost.crystals ? '' : 'insufficient'}">
                        💎 Cristaux: ${refineInfo.cost.crystals.toLocaleString()}
                    </div>
                    <div class="cost-item ${resources.essences >= refineInfo.cost.essences ? '' : 'insufficient'}">
                        ⚗️ Essences: ${refineInfo.cost.essences.toLocaleString()}
                    </div>
                    ${refineInfo.cost.fragments > 0 ? `<div class="cost-item ${resources.fragments >= refineInfo.cost.fragments ? '' : 'insufficient'}">
                        🔮 Fragments: ${refineInfo.cost.fragments.toLocaleString()}
                    </div>` : ''
                }
                    <div class="cost-item">
                        ⏱️ Temps: ${this.formatTime(refineInfo.time)}
                    </div>
                    <div class="cost-item ${refineInfo.currentForgeLevel >= refineInfo.requiredForgeLevel ? '' : 'insufficient'}">
                        ⚒️ Forge niveau ${refineInfo.requiredForgeLevel} requis (actuellement ${refineInfo.currentForgeLevel})
                    </div>
                </div>
            `;
        }

        panel.innerHTML = `
            <div class="refine-preview">
                <h3>Raffinage</h3>
                <div style="display: flex; justify-content: space-around; align-items: center; margin: 30px 0;">
                    <div style="text-align: center;">
                        <div style="font-size: 2em; color: #ffd700; margin-bottom: 10px;">${item.getStarDisplay()}</div>
                        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                            ${currentStatsHtml}
                        </div>
                    </div>
                    <div class="refine-arrow">→</div>
                    <div style="text-align: center;">
                        <div style="font-size: 2em; color: #ffd700; margin-bottom: 10px;">${'★'.repeat(item.stars + 1)}</div>
                        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                            ${newStatsHtml}
                        </div>
                    </div>
                </div>
            </div>
            ${reqHtml}
        <button class="refine-button" ${!refineInfo.canRefine ? 'disabled' : ''}>
            ${item.stars >= 7 ? 'Niveau maximum' : refineInfo.canRefine ? 'Raffiner' : 'Ressources insuffisantes'}
        </button>
        `;

        const refineBtn = panel.querySelector('.refine-button');
        if (refineBtn && !refineBtn.disabled) {
            refineBtn.onclick = () => {
                if (this.game.craftingSystem.refineItem(item)) {
                    this.showNotification(`Raffinage de ${item.name} démarré!`);
                    this.selectedCraftItem = null;
                    this.updateCraftingScreen();
                }
            };
        }
    }

    /**
     * Formats time in seconds to readable format
     */
    formatTime(seconds) {
        if (seconds < 60) return `${seconds} s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60} s`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes} m`;
    }

    /**
     * Updates the Village screen with the scene-based layout
     */
    updateVillageScreen() {
        if (this.currentScreen !== this.screens.VILLAGE) return;

        // This method now acts as the main render loop for the village scene
        this.updateVillageVisuals();
        this.updateBuildingsGrid(); // Renaming kept for compatibility but logic changes
        this.updateVillageResources();
    }

    /**
     * Updates the visual theme of the village based on Town Hall Level
     */
    updateVillageVisuals() {
        if (!this.game.villageSystem) return;

        // Visuals depend on Town Hall level as per user request
        const thLevel = this.game.villageSystem.buildings['town_hall'] ? this.game.villageSystem.buildings['town_hall'].level : 0;

        const villageScreen = document.getElementById('village-screen');
        const container = document.getElementById('village-background'); // This is .buildings-container

        if (!container) return;

        // Background Image Logic
        let bgPath = 'assets/backgrounds/village_ruins_bg.png';

        if (thLevel > 0) {
            // Cap at 7 as we only have assets up to lvl 7
            const assetLevel = Math.min(thLevel, 7);
            bgPath = `assets/backgrounds/village_bg_lvl_${assetLevel}.png`;
        }

        container.style.backgroundImage = `url('${bgPath}')`;

        // Update Tier Label (Still useful for context)
        const tierLabel = document.getElementById('village-tier-label');
        if (tierLabel) {
            const tier = this.game.villageSystem.getVillageTier();
            const names = ["Campement", "Bastion", "Citadelle"];
            tierLabel.textContent = `${names[tier - 1]} (Hôtel de Ville Lv.${thLevel})`;
        }
    }

    /**
     * Renders the buildings as sprites on the scene
     */
    updateBuildingsGrid() {
        const container = document.getElementById('village-background'); // Now the .buildings-container
        if (!container) return;

        // Clear existing sprites (or update them if optimization needed, for now rebuild)
        // We look for .building-sprite to clear, keeping other UI elements if any
        const existingSprites = container.querySelectorAll('.building-sprite');
        existingSprites.forEach(el => el.remove());

        const buildingData = BUILDING_DATABASE;
        const buildings = this.game.villageSystem.buildings;

        for (const [id, data] of Object.entries(buildingData)) {
            // Check if building exists in save data
            const state = buildings[id];

            // Skip hidden buildings (like old market_shop with negative coords)
            if (data.layout && data.layout.x < 0) continue;

            const level = state ? state.level : 0;
            const isBuilt = level > 0;

            // Create Sprite Element
            const sprite = document.createElement('div');
            sprite.className = 'building-sprite';
            if (state && state.isUpgrading) sprite.classList.add('upgrading');
            if (!isBuilt) sprite.classList.add('locked');

            // Position
            const layout = data.layout || { x: 50, y: 50, scale: 1.0, zIndex: 1 };
            sprite.style.left = `${layout.x}%`;
            sprite.style.top = `${layout.y}%`;
            sprite.style.zIndex = layout.zIndex || 10;

            // Determine sizing (base size * scale)
            // We assume a base width or use the image's natural size controlled by CSS width %?
            // Let's use a base width of around 15% of screen for scale 1.0
            const baseWidth = 120;
            sprite.style.width = `${baseWidth * layout.scale}px`;

            // Image Source Logic
            let imagePath = `assets/buildings/${id}/${id}_lvl${level}.png`;
            if (level === 0) {
                // Try ruins
                imagePath = `assets/buildings/ruins/${id}_ruins.png`;
                // If ruins don't exist, we might fallback to generic or lvl1 grayed out
                // We'll handle 404s via error handler to fallback? 
                // Alternatively, just show lvl1 grayed out if locked
                imagePath = `assets/buildings/${id}/${id}_lvl1.png`;
            } else if (level === 1) {
                imagePath = `assets/buildings/${id}/${id}_lvl1.png`;
            }
            // Note: If exact level asset missing, we rely on browser finding it or fallback?
            // Ideally we need a check, but for now we assume assets exist or we set an onerror

            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = data.name;
            img.draggable = false;

            // Simple fallback if specific level is missing (e.g. lvl 8 image doesn't exist yet, show lvl 7 or lvl 1)
            // This is hard without checking file existence first. 
            // We can assume standard tier fallback: lvl 1-3 -> lvl1 image, etc? 
            // For now, let's try direct map. If interactions fail, user sees broken image.

            img.onerror = () => {
                // Fallback to Tier 1 default or generic icon
                img.src = `assets/buildings/tier1/${id}.png`;
                img.onerror = () => {
                    // Ultimate fallback
                    img.style.display = 'none';
                    sprite.textContent = data.icon;
                    sprite.style.fontSize = '3em';
                    sprite.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    sprite.style.borderRadius = '50%';
                };
            };

            sprite.appendChild(img);

            // Label
            const label = document.createElement('div');
            label.className = 'building-label';
            label.innerHTML = `${data.name} <span style="color: #ffd700; margin-left:5px;">Lv.${level}</span>`;
            sprite.appendChild(label);

            // Indicators
            // Upgrade ready? (Town Hall check handled in canUpgrade)
            if (this.game.villageSystem.canUpgradeBuilding(id) && !state.isUpgrading) {
                const upIcon = document.createElement('div');
                upIcon.className = 'upgrade-ready-icon';
                upIcon.textContent = '⬆️';
                sprite.appendChild(upIcon);
            }

            // Production ready?
            if (this.game.villageSystem.calculateGeneratedResources(id) > 0) {
                const prodIcon = document.createElement('div');
                prodIcon.className = 'production-ready-icon';
                prodIcon.textContent = '💰'; // Or specific icon based on resource
                sprite.appendChild(prodIcon);
            }

            // Click Interaction
            sprite.onclick = () => {
                this.handleBuildingClick(id);
            };

            container.appendChild(sprite);
        }
    }

    /**
     * Handles clicks on building sprites
     * @param {string} buildingId 
     */
    handleBuildingClick(buildingId) {
        // Collect resources if production building
        const generated = this.game.villageSystem.calculateGeneratedResources(buildingId);
        if (generated > 0) {
            this.game.villageSystem.collectResources(buildingId);
            this.updateVillageResources();
            // Optional: Play sound or show floating number
            this.showNotification(`Récolte : +${generated}`);
            this.updateBuildingsGrid(); // Update icons
            return;
        }

        // Feature Navigation
        switch (buildingId) {
            case 'town_hall':
            case 'crystal_mine':
            case 'alchemy_lab':
            case 'warehouse':
                // Open Upgrade/Details Modal
                // Special case for warehouse: open Inventory?
                if (buildingId === 'warehouse') {
                    this.showScreen(this.screens.INVENTORY);
                    return;
                }
                this.openBuildingModal(buildingId);
                break;

            case 'market':
                // Open Shop Screen
                this.showScreen(this.screens.SHOP);
                break;

            case 'forgeron':
                // Open Blacksmith (Guild -> Blacksmith tab)
                this.openGuildScreen();
                this.updateGuildScreen('blacksmith');
                break;

            case 'sanctuary':
                // Open Summon Screen (Or Evolution)
                this.showSummonScreen();
                break;

            case 'arena':
                this.showModal("Arène PVP", "L'arène ouvrira ses portes bientôt ! Préparez vos champions.");
                break;

            case 'guild':
                this.showModal("Guilde", "Le système de guilde et d'échanges communautaires arrive prochainement.");
                break;

            case 'portal':
                this.showModal("Portail Monde", "L'exploration du monde et les donjons PVM sont en cours de découverte.");
                break;

            default:
                this.openBuildingModal(buildingId);
                break;
        }
    }

    // Helper to show generic modal
    showModal(title, message) {
        // Simple alert for now or a generic custom modal if implemented
        alert(`${title}\n\n${message}`);
    }

    /**
     * Legacy method kept if referenced, but now empty or redirecting
     */
    updateVillageResources() {
        const resources = this.game.economySystem.resources;
        // Update top bar logic here if needed...
        // Assuming header updates elsewhere or using economySystem.updateUI()
    }
    // ========== STORY MODE METHODS ==========

    /**
     * Opens the story screen and displays zones
     */
    openStoryScreen() {
        this.showScreen(this.screens.STORY);
        this.updateStoryScreen();
    }

    /**
     * Updates the story screen (shows zone selection)
     */
    updateStoryScreen() {
        // Show zone selection, hide stage selection
        const zoneSelection = document.getElementById('zone-selection');
        const stageSelection = document.getElementById('stage-selection');

        if (zoneSelection) zoneSelection.style.display = 'block';
        if (stageSelection) stageSelection.style.display = 'none';

        this.renderZoneSelection();
    }

    /**
     * Renders all zones with their unlock status
     */
    renderZoneSelection() {
        const zonesGrid = document.getElementById('zones-grid');
        if (!zonesGrid) return;

        zonesGrid.innerHTML = '';

        const zones = this.game.storySystem.getAllZonesWithStatus();

        zones.forEach(zone => {
            const zoneCard = document.createElement('div');
            zoneCard.className = 'zone-card';
            if (!zone.unlocked) zoneCard.classList.add('locked');
            if (zone.progress.completed) zoneCard.classList.add('completed');

            // Calculate progress
            const stages = this.game.storySystem.getZoneStagesWithStatus(zone.id);
            const completedStages = stages ? stages.filter(s => s.completed).length : 0;
            const totalStages = 11; // 10 stages + 1 boss
            const progressPercent = Math.floor((completedStages / totalStages) * 100);

            zoneCard.innerHTML = `
            <div class="zone-card-header">
                    <span class="zone-number">Zone ${zone.id}</span>
                    <span class="${zone.unlocked ? 'zone-unlock-icon' : 'zone-lock-icon'}">
                        ${zone.unlocked ? '✓' : '🔒'}
                    </span>
                </div>
                <h3 class="zone-card-title">${zone.name}</h3>
                <p class="zone-card-description">${zone.description}</p>
                <p class="zone-card-theme">${zone.theme}</p>
                <div class="zone-card-progress">
                    <div class="zone-progress-text">${completedStages} / ${totalStages} étapes</div>
                    <div class="zone-progress-bar">
                        <div class="zone-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
        `;

            if (zone.unlocked) {
                zoneCard.onclick = () => this.showZoneStages(zone.id);
            }

            zonesGrid.appendChild(zoneCard);
        });
    }

    /**
     * Shows the stages for a specific zone
     */
    showZoneStages(zoneId) {
        const zoneSelection = document.getElementById('zone-selection');
        const stageSelection = document.getElementById('stage-selection');

        if (zoneSelection) zoneSelection.style.display = 'none';
        if (stageSelection) stageSelection.style.display = 'block';

        this.renderStageSelection(zoneId);
    }

    /**
     * Renders the stages for a specific zone
     */
    renderStageSelection(zoneId) {
        const zoneInfo = document.getElementById('zone-info');
        const stagesGrid = document.getElementById('stages-grid');

        if (!zoneInfo || !stagesGrid) return;

        const zoneData = this.game.storySystem.getZoneData(zoneId);
        const stages = this.game.storySystem.getZoneStagesWithStatus(zoneId);

        if (!zoneData || !stages) return;

        // Render zone info
        zoneInfo.innerHTML = `
            <div class="zone-info-header">
                <h3 class="zone-info-title">${zoneData.name}</h3>
                <span class="zone-info-energy">⚡ ${zoneData.energyCost} énergie/étape</span>
            </div>
            <p class="zone-info-description">${zoneData.description}</p>
        `;

        // Render stages
        stagesGrid.innerHTML = '';

        stages.forEach(stage => {
            const stageCard = document.createElement('div');
            stageCard.className = 'stage-card';
            if (!stage.unlocked) stageCard.classList.add('locked');
            if (stage.completed) stageCard.classList.add('completed');
            if (stage.isBoss) stageCard.classList.add('boss');

            const stageIcon = stage.isBoss ? '👹' : stage.unlocked ? '⚔️' : '🔒';

            stageCard.innerHTML = `
            <div class="stage-number"> Étape ${stage.stageId}</div>
                <div class="${stage.isBoss ? 'boss-icon' : 'stage-icon'}">${stageIcon}</div>
                <h4 class="stage-name">${stage.name}</h4>
                <p class="stage-energy">⚡ ${stage.energyCost}</p>
        `;

            if (stage.unlocked) {
                stageCard.onclick = () => this.startStage(zoneId, stage.stageId);
            }

            stagesGrid.appendChild(stageCard);
        });
    }

    /**
     * Starts a specific stage
     */
    startStage(zoneId, stageId) {
        console.log(`[UIManager] Starting Zone ${zoneId}, Stage ${stageId} `);

        const success = this.game.storySystem.startStage(zoneId, stageId);

        if (success) {
            this.game.startBattle();
        } else {
            alert('Impossible de démarrer cette étape.');
        }
    }

    // ========== END STORY MODE METHODS ==========

    formatTime(seconds) {
        if (seconds < 60) return `${seconds} s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60} s`;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes} m`;
    }
}

