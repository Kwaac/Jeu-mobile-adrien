# Liste des Statistiques Modifiables

Voici la liste des statistiques qui pourront être modifiées par les équipements (Base + Substats).

## 1. Statistiques de Base (Déjà Implémentées)
Ces stats sont le cœur du système actuel.

| Stat | Nom Complet | Effet | Source Principale |
|---|---|---|---|
| **HP** | Points de Vie (Max HP) | Détermine la survie avant la mort. | Armure, Casque, Amulette |
| **ATK** | Attaque | Augmente tous les dégâts infligés. | Arme, Accessoire, Epaulettes |
| **DEF** | Défense | Réduit les dégâts subis (Formule: Dégâts - DEF). | Armure, Casque, Bouclier |
| **SPD** | Vitesse (Speed) | Remplit la jauge d'action (ATB) plus vite. | Bottes, Dague, Bonus Légers |

## 2. Statistiques Avancées (À Implémenter pour la V2)
C'est ici que se joue la **personnalisation fine** (Substats). Je dois mettre à jour `Unit.js` pour gérer ces nouvelles variables.

| Stat | Nom Complet | Effet Prévu |
|---|---|---|
| **CRIT** | Chances de Critique (%) | Chance de doubler les dégâts (x2). |
| **CRIT_DMG** | Dégâts Critiques (%) | Augmente le multiplicateur critique (par défaut x1.5 -> x2.0+). |
| **DODGE** | Esquive (%) | Chance d'annuler complètement une attaque (Miss). |
| **ACC** | Précision (%) | Contre l'Esquive adverse. |
| **LIFESTEAL** | Vol de Vie (%) | Soigne le lanceur d'un % des dégâts infligés. |
| **HEAL_POWER**| Soin (%) | Augmente l'efficacité des soins prodigués (Healers). |
| **RES_FIRE** | Résistance Feu (%) | Réduit les dégâts de l'élément Feu. |
| **RES_ICE** | Résistance Eau (%) | Réduit les dégâts de l'élément Eau. |
| **RES_EARTH** | Résistance Terre (%) | Réduit les dégâts de l'élément Terre. |
| **RES_THUNDER**| Résistance Foudre (%) | Réduit les dégâts de l'élément Foudre. |
| **RES_DARK** | Résistance Ténèbres (%)| Réduit les dégâts de l'élément Ténèbres. |
| **RES_LIGHT** | Résistance Lumière (%) | Réduit les dégâts de l'élément Lumière. |

---

## Plan d'Action Technique
Pour activer ces nouvelles stats :
1.  Modifier `Unit.js` pour accepter ces propriétés.
2.  Mettre à jour `BattleSystem.js` -> `unit.attack()` pour vérifier le **Critique** et l'**Esquive**.
3.  Ajouter le calcul des **Résistances Élémentaires** dans la formule de dégâts.
