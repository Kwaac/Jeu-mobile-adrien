"""
Script pour ajouter la gestion d'équipement à l'inventaire
"""

# Lire le fichier
with open('d:/Jeu-mobile-adrien/js/ui/UIManager.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Ajouter le panneau d'équipement dans le HTML de l'inventaire
old_items_section = '''                <!-- Items en grille -->
                <div class="items-section">'''

new_with_panel = '''                <!-- Panneau d'équipement du héros sélectionné -->
                <div class="equipment-panel" id="hero-equipment-panel" style="display: none;">
                    <h4 id="selected-hero-name">Sélectionnez un héros</h4>
                    <div class="equipment-slots-display">
                        <div class="equipment-slot-item" data-slot="weapon">
                            <span class="slot-label">⚔️ Arme:</span>
                            <span class="slot-content" id="slot-weapon-inv">Vide</span>
                            <button class="btn-unequip-inv" data-slot="weapon" style="display: none;">✖</button>
                        </div>
                        <div class="equipment-slot-item" data-slot="armor">
                            <span class="slot-label">🛡️ Armure:</span>
                            <span class="slot-content" id="slot-armor-inv">Vide</span>
                            <button class="btn-unequip-inv" data-slot="armor" style="display: none;">✖</button>
                        </div>
                        <div class="equipment-slot-item" data-slot="accessory">
                            <span class="slot-label">💍 Accessoire:</span>
                            <span class="slot-content" id="slot-accessory-inv">Vide</span>
                            <button class="btn-unequip-inv" data-slot="accessory" style="display: none;">✖</button>
                        </div>
                    </div>
                    <div class="hero-stats-display" id="hero-stats-inv"></div>
                </div>
                
                <!-- Items en grille -->
                <div class="items-section">'''

content = content.replace(old_items_section, new_with_panel)

# 2. Modifier renderInventoryPartyUnits pour ajouter la sélection
old_render = '''            partyContainer.appendChild(unitCard);
        });
    }

    updateInventoryGrid(filterType) {'''

new_render = '''            // Add click event for selection
            unitCard.addEventListener('click', () => {
                this.selectHeroForEquipment(unit);
            });

            partyContainer.appendChild(unitCard);
        });
    }

    selectHeroForEquipment(unit) {
        this.selectedHeroForEquipment = unit;
        
        // Update visual selection
        document.querySelectorAll('#inventory-party-units .party-unit-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.party-unit-card').classList.add('selected');
        
        // Show equipment panel
        const panel = document.getElementById('hero-equipment-panel');
        if (panel) panel.style.display = 'block';
        
        // Update equipment display
        this.updateHeroEquipmentDisplay(unit);
    }

    updateHeroEquipmentDisplay(unit) {
        // Update hero name
        const nameEl = document.getElementById('selected-hero-name');
        if (nameEl) nameEl.textContent = `Équipement de ${unit.name}`;
        
        // Update equipment slots
        const slots = ['weapon', 'armor', 'accessory'];
        slots.forEach(slot => {
            const contentEl = document.getElementById(`slot-${slot}-inv`);
            const btnEl = document.querySelector(`.btn-unequip-inv[data-slot="${slot}"]`);
            
            if (unit.equipment && unit.equipment[slot]) {
                const item = unit.equipment[slot];
                if (contentEl) contentEl.textContent = item.name;
                if (btnEl) {
                    btnEl.style.display = 'inline-block';
                    btnEl.onclick = () => this.unequipItemFromHero(unit, slot);
                }
            } else {
                if (contentEl) contentEl.textContent = 'Vide';
                if (btnEl) btnEl.style.display = 'none';
            }
        });
        
        // Update stats display
        const statsEl = document.getElementById('hero-stats-inv');
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
                <div class="stat-line">HP: ${baseHp} ${hpBonus > 0 ? `<span class="stat-bonus">(+${hpBonus})</span>` : ''} = ${totalHp}</div>
                <div class="stat-line">ATK: ${baseAtk} ${atkBonus > 0 ? `<span class="stat-bonus">(+${atkBonus})</span>` : ''} = ${totalAtk}</div>
                <div class="stat-line">DEF: ${baseDef} ${defBonus > 0 ? `<span class="stat-bonus">(+${defBonus})</span>` : ''} = ${totalDef}</div>
            `;
        }
    }

    unequipItemFromHero(unit, slot) {
        if (!unit.equipment || !unit.equipment[slot]) return;
        
        const item = unit.equipment[slot];
        unit.unequip(slot);
        this.game.economySystem.inventory.push(item);
        
        this.updateHeroEquipmentDisplay(unit);
        this.updateInventoryGrid(document.querySelector('.tab-btn.active').dataset.tab);
        this.renderInventoryPartyUnits();
    }

    updateInventoryGrid(filterType) {'''

content = content.replace(old_render, new_render)

# 3. Modifier updateInventoryGrid pour ajouter le clic d'équipement
old_grid_append = '''            // Add tooltip or click event for details
            itemCard.title = `${item.name}\\n${item.type.toUpperCase()}\\n${this.getItemStatsString(item)}\\n${item.description || ''}`;

            grid.appendChild(itemCard);'''

new_grid_append = '''            // Add tooltip
            itemCard.title = `${item.name}\\n${item.type.toUpperCase()}\\n${this.getItemStatsString(item)}\\n${item.description || ''}`;
            
            // Add click event to equip on selected hero
            itemCard.addEventListener('click', () => {
                if (this.selectedHeroForEquipment) {
                    this.equipItemOnSelectedHero(item);
                } else {
                    alert('Sélectionnez d\\'abord un héros !');
                }
            });

            grid.appendChild(itemCard);'''

content = content.replace(old_grid_append, new_grid_append)

# 4. Ajouter la méthode equipItemOnSelectedHero avant la fin de la classe
old_end = '''    }
}'''

new_end = '''    }

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
        this.updateInventoryGrid(document.querySelector('.tab-btn.active').dataset.tab);
        this.renderInventoryPartyUnits();
    }
}'''

content = content.replace(old_end, new_end)

# Écrire le fichier modifié
with open('d:/Jeu-mobile-adrien/js/ui/UIManager.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Modifications appliquées avec succès !")
