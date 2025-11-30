# Brave RPG - Jeu Mobile

Un jeu RPG mobile de style "Brave Frontier" développé en JavaScript vanilla avec HTML5 Canvas.

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** installé (pour le serveur HTTP local)
- Un navigateur web moderne (Chrome, Firefox, Edge)

### Installation et Lancement

1. **Cloner ou télécharger le projet**
   ```bash
   cd d:\Jeu-mobile-adrien
   ```

2. **Démarrer le serveur HTTP local** (OBLIGATOIRE)
   
   Le jeu utilise des modules ES6 qui nécessitent un serveur HTTP (ne fonctionne pas avec `file://`).
   
   **Option A - Avec npx (recommandé)** :
   ```powershell
   powershell -ExecutionPolicy Bypass -Command "npx -y http-server -p 8000"
   ```
   
   **Option B - Avec Python** :
   ```bash
   python -m http.server 8000
   ```
   
   **Option C - Avec Node.js** :
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```

3. **Ouvrir dans le navigateur**
   
   Naviguer vers : **http://127.0.0.1:8000/index.html**

## 📁 Structure du Projet

```
Jeu-mobile-adrien/
├── index.html              # Point d'entrée HTML
├── css/
│   ├── style.css          # Styles principaux
│   ├── equipment-panel.css
│   ├── equipment-new.css
│   └── inventory-*.css    # Styles de l'inventaire
├── js/
│   ├── main.js            # Point d'entrée JavaScript
│   ├── core/
│   │   └── Game.js        # Classe principale du jeu
│   ├── entities/
│   │   └── Unit.js        # Classe des personnages
│   ├── systems/
│   │   ├── BattleSystem.js      # Système de combat
│   │   ├── EconomySystem.js     # Système d'économie
│   │   ├── QuestSystem.js       # Système de quêtes
│   │   ├── PartyManager.js      # Gestion de l'équipe
│   │   ├── LootManager.js       # Gestion du butin
│   │   └── EvolutionSystem.js   # Système d'évolution
│   ├── ui/
│   │   └── UIManager.js   # Gestion de l'interface
│   ├── data/
│   │   └── UnitDatabase.js      # Base de données des unités
│   └── items/
│       └── ItemDatabase.js      # Base de données des objets
└── README.md              # Ce fichier
```

## 🎮 Fonctionnalités Actuelles

### ✅ Implémenté
- **Menu Principal** avec navigation par cartes
- **Système de Combat** avec animations
  - Sélection de cibles
  - Animations d'attaque
  - Brave Burst (attaque spéciale)
  - Jauge BB qui se remplit au combat
- **Gestion d'Équipe**
  - Ajout/retrait de personnages (max 5)
  - Affichage des stats
  - Système d'évolution
- **Inventaire RPG** (style 2 colonnes)
  - Fiche personnage avec stats détaillées
  - Emplacements d'équipement (Arme, Armure, Accessoire)
  - Grille d'objets avec filtres
  - Sélection de héros
- **Système d'Économie**
  - Gemmes, Or, Énergie
  - Boutique avec achat de gemmes
  - Invocation de héros
- **Système de Quêtes**
  - Sélection de quêtes
  - Coût en énergie
  - Récompenses

### ⚠️ En Développement
- Équipement d'objets sur les héros (interface prête, logique à finaliser)
- Base de données d'objets complète
- Système de sauvegarde/chargement
- Plus de types d'ennemis
- Système de compétences avancé

## 🔧 Problèmes Connus et Solutions

### Le jeu ne se charge pas (écran "Initializing...")

**Cause** : Modules ES6 bloqués par CORS avec le protocole `file://`

**Solution** : Toujours utiliser un serveur HTTP local (voir section Démarrage Rapide)

### Le serveur ne sert pas les dernières modifications

**Cause** : Cache du serveur http-server

**Solution** : 
1. Arrêter le serveur (Ctrl+C)
2. Relancer le serveur
3. Faire un hard refresh dans le navigateur (Ctrl+Shift+R ou Ctrl+F5)

### Erreurs de modules dans la console

**Cause** : Chemins de fichiers incorrects ou fichiers manquants

**Solution** : Vérifier que tous les fichiers `.js` sont présents et que les imports utilisent les bons chemins relatifs

## 📝 Modifications Récentes

### 30 Novembre 2025
- ✅ Correction du problème CORS (ajout serveur HTTP obligatoire)
- ✅ Masquage du debug overlay après initialisation
- ✅ Vérification de l'interface d'inventaire 2 colonnes
- ✅ Test des filtres d'inventaire (fonctionnels)
- ⚠️ Changement "Équipement" → "Équipe" (en attente de refresh serveur)

## 🎯 Prochaines Étapes

1. **Finaliser le système d'équipement**
   - Connecter les clics d'objets à la logique d'équipement
   - Ajouter des objets réels dans la base de données
   - Implémenter le déséquipement

2. **Améliorer la base de données**
   - Ajouter plus d'unités
   - Ajouter des armes, armures, accessoires variés
   - Définir les stats et effets des objets

3. **Système de sauvegarde**
   - LocalStorage pour sauvegarder la progression
   - Import/Export de sauvegarde

4. **Optimisations**
   - Sprites pour les personnages
   - Animations plus fluides
   - Sons et musique

## 🐛 Débogage

Pour activer les logs de débogage, ouvrir la console du navigateur (F12) et vérifier :
- `[MAIN.JS] Module loaded` - Confirme que les modules se chargent
- Logs du `Game.js` - Initialisation du jeu
- Logs du `UIManager.js` - Création des écrans

## 📞 Support

En cas de problème :
1. Vérifier que le serveur HTTP est bien lancé
2. Ouvrir la console du navigateur (F12) pour voir les erreurs
3. Faire un hard refresh (Ctrl+Shift+R)
4. Vérifier que tous les fichiers sont présents

## 📄 Licence

Projet personnel - Tous droits réservés
