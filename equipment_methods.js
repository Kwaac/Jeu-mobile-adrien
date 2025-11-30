// ===================================
// MÉTHODES À AJOUTER À UIManager.js
// ===================================

// 1. MODIFIER renderInventoryPartyUnits() - Ajouter après la ligne "partyContainer.appendChild(unitCard);"
/*
            // Add click event for selection
            unitCard.addEventListener('click', () => {
                this.selectHeroForEquipment(unit);
            });
*/

// 2. NOUVELLE MÉTHODE - Ajouter après renderInventoryPartyUnits()
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

// 3. NOUVELLE MÉTHODE - Ajouter après selectHeroForEquipment()
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

// 4. NOUVELLE MÉTHODE - Ajouter après updateHeroEquipmentDisplay()
unequipItemFromHero(unit, slot) {
    if (!unit.equipment || !unit.equipment[slot]) return;

    const item = unit.equipment[slot];
    unit.unequip(slot);
    this.game.economySystem.inventory.push(item);

    this.updateHeroEquipmentDisplay(unit);
    this.updateInventoryGrid(document.querySelector('.tab-btn.active').dataset.tab);
    this.renderInventoryPartyUnits();
}

// 5. NOUVELLE MÉTHODE - Ajouter à la fin de la classe (avant le dernier })
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

// 6. MODIFIER updateInventoryGrid() - Ajouter avant "grid.appendChild(itemCard);"
/*
            // Add click event to equip on selected hero
            itemCard.addEventListener('click', () => {
                if (this.selectedHeroForEquipment) {
                    this.equipItemOnSelectedHero(item);
                } else {
                    alert('Sélectionnez d\'abord un héros !');
                }
            });
*/
