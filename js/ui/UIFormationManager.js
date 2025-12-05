export default class UIFormationManager {
    constructor(game, uiManager) {
        this.game = game;
        this.uiManager = uiManager;
    }

    /**
     * Renders the tactical formation screen
     * Allows drag and drop of units to positions
     */
    renderFormationScreen() {
        const screen = document.getElementById('game-screen');
        if (!screen) return;

        screen.innerHTML = `
            <div class="formation-screen" style="width: 100%; height: 100%; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; background: #1a1a2e; color: white;">
                <div class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>Formation Tactique</h2>
                    <button class="close-btn" style="background: #e74c3c; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer;">Retour</button>
                </div>

                <div class="formation-container" style="flex: 1; display: flex; gap: 20px;">
                    <!-- Grille de Formation -->
                    <div class="formation-grid-area" style="flex: 2; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 20px; position: relative;">
                        <h3 style="text-align: center; color: #3498db;">Ligne Arrière (Back) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Ligne Avant (Front)</h3>
                        
                        <div class="tactical-grid" style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; gap: 15px; height: 400px; width: 300px; margin: 0 auto; position: relative;">
                            <!-- Positions generated here -->
                        </div>
                        
                        <div class="enemy-preview" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); text-align: center; opacity: 0.5;">
                            <div style="font-size: 40px;">⚔️</div>
                            <div>Ennemis</div>
                        </div>
                    </div>

                    <!-- Liste des Unités -->
                    <div class="units-sidebar" style="flex: 1; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px; overflow-y: auto;">
                        <h3 style="margin-top: 0;">Unités Disponibles</h3>
                        <div id="formation-units-list" style="display: flex; flex-direction: column; gap: 10px;">
                            <!-- Units list -->
                        </div>
                    </div>
                </div>
                
                <div class="formation-info" style="margin-top: 20px; padding: 10px; background: rgba(52, 152, 219, 0.2); border-radius: 5px; font-size: 0.9em;">
                    <p>ℹ️ <strong>Règle de base :</strong> Les ennemis doivent éliminer la <strong>Ligne Avant</strong> avant de pouvoir attaquer la Ligne Arrière.</p>
                    <p>⚠️ <strong>Assassin :</strong> Les Assassins peuvent ignorer cette règle et cibler directement la Ligne Arrière.</p>
                </div>
            </div>
        `;

        // Render Grid Slots
        const gridContainer = screen.querySelector('.tactical-grid');
        const positions = [
            { id: 3, name: 'Back-Top', type: 'back' }, { id: 0, name: 'Front-Top', type: 'front' },
            { id: 4, name: 'Back-Mid', type: 'back' }, { id: 1, name: 'Front-Mid', type: 'front' },
            { id: 5, name: 'Back-Bot', type: 'back' }, { id: 2, name: 'Front-Bot', type: 'front' }
        ];

        positions.forEach(pos => {
            const slot = document.createElement('div');
            slot.className = `formation-slot ${pos.type}-line`;
            slot.dataset.position = pos.id;
            slot.style.cssText = `
                border: 2px dashed ${pos.type === 'front' ? '#e67e22' : '#9b59b6'};
                background: rgba(0,0,0,0.2);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            `;

            slot.innerHTML = `<span style="font-size: 0.8em; opacity: 0.5;">${pos.name}</span>`;

            // Drag events
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.style.background = 'rgba(255,255,255,0.1)';
            });

            slot.addEventListener('dragleave', () => {
                slot.style.background = 'rgba(0,0,0,0.2)';
            });

            slot.addEventListener('drop', (e) => this.handleFormationDrop(e, pos.id));

            gridContainer.appendChild(slot);
        });

        // Render Units
        this.updateFormationUnits();

        // Close button
        screen.querySelector('.close-btn').addEventListener('click', () => {
            if (this.uiManager && this.uiManager.screens) {
                this.uiManager.showScreen(this.uiManager.screens.EQUIPMENT);
            }
        });
    }

    updateFormationUnits() {
        const party = this.game.partyManager.getParty();
        const slots = document.querySelectorAll('.formation-slot');

        // Clear slots first (except label)
        slots.forEach(slot => {
            const label = slot.querySelector('span');
            slot.innerHTML = '';
            if (label) slot.appendChild(label);
        });

        party.forEach(unit => {
            // Create draggable unit visual
            const unitEl = document.createElement('div');
            unitEl.draggable = true;
            unitEl.dataset.unitId = unit.instanceId;
            unitEl.style.cssText = `
                width: 60px; height: 60px;
                background: ${unit.color || '#3498db'};
                border-radius: 50%;
                display: flex; 
                justify-content: center; 
                align-items: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                cursor: grab;
                z-index: 2;
                border: 2px solid ${this.getBorderColorForClass(unit.class)};
                position: relative;
            `;

            // Class icon
            const icon = this.getIconForClass(unit.class);
            unitEl.innerHTML = `<span style="font-size: 24px;">${icon}</span>`;

            // Drag events
            unitEl.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('unitId', unit.instanceId);
                unitEl.style.opacity = '0.5';
            });

            unitEl.addEventListener('dragend', () => {
                unitEl.style.opacity = '1';
            });

            // Place in slot or sidebar
            if (unit.savedPosition !== null && unit.savedPosition >= 0) {
                const targetSlot = document.querySelector(`.formation-slot[data-position="${unit.savedPosition}"]`);
                if (targetSlot) {
                    // Remove label for cleaner look if occupied
                    const label = targetSlot.querySelector('span');
                    if (label) label.style.display = 'none';
                    targetSlot.appendChild(unitEl);
                }
            } else {
                // Should not happen if auto-assigned, but fallback to list
                const list = document.getElementById('formation-units-list');
                if (list) list.appendChild(unitEl);
            }
        });
    }

    handleFormationDrop(e, targetPosition) {
        e.preventDefault();
        const unitId = e.dataTransfer.getData('unitId');
        const unit = this.game.partyManager.getParty().find(u => u.instanceId === unitId);

        if (unit) {
            this.game.partyManager.saveUnitPosition(unit, parseInt(targetPosition));
            this.updateFormationUnits(); // Re-render to show change
        }

        // Reset styles
        document.querySelectorAll('.formation-slot').forEach(s => s.style.background = 'rgba(0,0,0,0.2)');
    }

    getIconForClass(className) {
        const icons = {
            'Warrior': '⚔️',
            'Tank': '🛡️',
            'Mage': '⚡',
            'Support': '💚',
            'Ranger': '🏹',
            'Assassin': '🗡️'
        };
        return icons[className] || '❓';
    }

    getBorderColorForClass(className) {
        const colors = {
            'Warrior': '#e74c3c',
            'Tank': '#2ecc71',
            'Mage': '#9b59b6',
            'Support': '#3498db',
            'Ranger': '#f1c40f',
            'Assassin': '#34495e'
        };
        return colors[className] || '#fff';
    }
}
