#!/usr/bin/env python3
"""
Script pour ajouter la fonctionnalité de déséquipement par clic sur les slots équipés
"""

import re

# Lire le fichier
with open('js/ui/UIManager.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern pour trouver le bloc à remplacer dans updateHeroEquipmentDisplay
# On cherche le bloc qui gère les items équipés

old_pattern = r'''            if \(itemImg\) \{
                itemImg\.textContent = icon;
                itemImg\.style\.display = 'flex';
            \}
            if \(iconEl\) iconEl\.style\.opacity = '0'; // Hide default icon
            if \(unequipBtn\) \{
                unequipBtn\.style\.display = 'none'; // Hidden by default, shown on hover via CSS
                unequipBtn\.onclick = \(e\) => \{
                    e\.stopPropagation\(\);
                    this\.unequipItemFromHero\(unit, slot\);
                \};
            \}
            slotEl\.title = `\$\{item\.name\} \(Niv\. \$\{item\.level \|\| 1\}\)`;
            slotEl\.classList\.add\('equipped'\);'''

new_code = '''            if (itemImg) {
                itemImg.textContent = icon;
                itemImg.style.display = 'flex';
            }
            if (iconEl) iconEl.style.opacity = '0'; // Hide default icon
            
            // Click to unequip - simpler and more mobile-friendly
            slotEl.style.cursor = 'pointer';
            slotEl.onclick = () => {
                this.unequipItemFromHero(unit, slot);
            };
            
            slotEl.title = `${item.name} (Niv. ${item.level || 1}) - Cliquez pour déséquiper`;
            slotEl.classList.add('equipped');'''

# Remplacer
content = re.sub(old_pattern, new_code, content)

# Pattern pour les slots vides
old_empty_pattern = r'''            if \(iconEl\) iconEl\.style\.opacity = '0\.3'; // Show default icon
            if \(unequipBtn\) unequipBtn\.style\.display = 'none';
            slotEl\.title = slot\.charAt\(0\)\.toUpperCase\(\) \+ slot\.slice\(1\);
            slotEl\.classList\.remove\('equipped'\);'''

new_empty_code = '''            if (iconEl) iconEl.style.opacity = '0.3'; // Show default icon
            slotEl.style.cursor = 'default';
            slotEl.onclick = null;
            slotEl.title = slot.charAt(0).toUpperCase() + slot.slice(1);
            slotEl.classList.remove('equipped');'''

content = re.sub(old_empty_pattern, new_empty_code, content)

# Écrire le fichier modifié
with open('js/ui/UIManager.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Modification appliquée avec succès!")
print("Les slots équipés sont maintenant cliquables pour déséquiper les items.")
