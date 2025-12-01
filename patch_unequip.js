// Script Node.js pour patcher UIManager.js
const fs = require('fs');

// Lire le fichier
let content = fs.readFileSync('js/ui/UIManager.js', 'utf8');

// Trouver et remplacer le bloc pour les items équipés
const oldEquipped = `            if (itemImg) {
                itemImg.textContent = icon;
                itemImg.style.display = 'flex';
            }
            if (iconEl) iconEl.style.opacity = '0'; // Hide default icon
            if (unequipBtn) {
                unequipBtn.style.display = 'none'; // Hidden by default, shown on hover via CSS
                unequipBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.unequipItemFromHero(unit, slot);
                };
            }
            slotEl.title = \`\${item.name} (Niv. \${item.level || 1})\`;
            slotEl.classList.add('equipped');`;

const newEquipped = `            if (itemImg) {
                itemImg.textContent = icon;
                itemImg.style.display = 'flex';
            }
            if (iconEl) iconEl.style.opacity = '0'; // Hide default icon
            
            // Click to unequip - simpler and more mobile-friendly
            slotEl.style.cursor = 'pointer';
            slotEl.onclick = () => {
                this.unequipItemFromHero(unit, slot);
            };
            
            slotEl.title = \`\${item.name} (Niv. \${item.level || 1}) - Cliquez pour déséquiper\`;
            slotEl.classList.add('equipped');`;

content = content.replace(oldEquipped, newEquipped);

// Trouver et remplacer le bloc pour les slots vides
const oldEmpty = `            if (iconEl) iconEl.style.opacity = '0.3'; // Show default icon
            if (unequipBtn) unequipBtn.style.display = 'none';
            slotEl.title = slot.charAt(0).toUpperCase() + slot.slice(1);
            slotEl.classList.remove('equipped');`;

const newEmpty = `            if (iconEl) iconEl.style.opacity = '0.3'; // Show default icon
            slotEl.style.cursor = 'default';
            slotEl.onclick = null;
            slotEl.title = slot.charAt(0).toUpperCase() + slot.slice(1);
            slotEl.classList.remove('equipped');`;

content = content.replace(oldEmpty, newEmpty);

// Écrire le fichier modifié
fs.writeFileSync('js/ui/UIManager.js', content, 'utf8');

console.log('✅ Modification appliquée avec succès!');
console.log('Les slots équipés sont maintenant cliquables pour déséquiper les items.');
