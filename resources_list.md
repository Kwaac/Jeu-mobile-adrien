# Liste des Ressources et Matériaux

Voici la liste complète des ressources actuellement implémentées dans le jeu et leur utilité pour l'amélioration (Raffinage/Forge).

## 1. Monnaies Principales

| Ressource | Usage Principal | Source |
|---|---|---|
| **Gold (Or)** | Monnaie universelle. Utilisée pour **tout** (Achat, Craft, Evolution). | Combats, Vente d'objets, Quêtes. |
| **Gems (Gemmes)** | Monnaie Premium. Invocations, refils d'énergie. | Achats, Récompenses Quêtes/Connexion. |

## 2. Matériaux de Craft & Raffinage (Forge)

Ces matériaux sont requis pour augmenter le niveau d'étoiles des équipements (1★ -> 7★) via la Forge.

| Ressource | Usage | Source (Suggérée) |
|---|---|---|
| **Crystals (Cristaux)** | Matériau de base pour le Raffinage (Niv 1-7). Coût progressif. | Donjons de Matériaux, Démantèlement. |
| **Essences** | Matériau intermédiaire. Requis à partir du passage 2★ -> 3★. | Boss de Donjon, Alchimie. |
| **Fragments** | Matériau rare. Requis à partir du passage 3★ -> 4★. | Raids, Evénements, Démantèlement Rare. |

### Tableau des Coûts de Raffinage (Actuel)

| Passage | Gold | Cristaux | Essences | Fragments | Temps |
|---|---|---|---|---|---|
| 1★ -> 2★ | 1,000 | 50 | 10 | 0 | 1 min |
| 2★ -> 3★ | 2,500 | 100 | 25 | 5 | 3 min |
| 3★ -> 4★ | 5,000 | 200 | 50 | 10 | 5 min |
| 4★ -> 5★ | 10,000 | 400 | 100 | 20 | 10 min |
| 5★ -> 6★ | 20,000 | 800 | 200 | 40 | 20 min |
| 6★ -> 7★ | 40,000 | 1,600 | 400 | 80 | 30 min |

## 3. Matériaux d'Évolution (Unités)

*(Note: Le système d'évolution des unités mentionne l'usage de doublons ou de matériaux spécifiques, mais `EconomySystem` ne liste pas encore de "Totems" ou "Idoles" spécifiques, seulement des "Fragments" génériques pour l'instant, ou l'usage direct d'unités en doublon).*

---

### Analyse pour "Amélioration des Items"
Actuellement, l'amélioration se fait par **Raffinage** (Etoiles).
- Le système consomme `Gold`, `Crystals`, `Essences`, `Fragments`.
- Le coût augmente exponentiellement.
- Le temps augmente également.

Est-ce que cette liste correspond à votre vision pour la suite ? Voulez-vous ajouter des matériaux spécifiques par Type (ex: "Acier" pour Armes, "Tissu" pour Armures) ?
