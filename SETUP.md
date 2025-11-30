# Guide de Configuration - Nouvel Ordinateur

Ce guide vous aide à configurer le projet sur un nouvel ordinateur.

## 📋 Checklist de Transfert

### 1. Copier les Fichiers

**Option A - Avec Git (recommandé)**
```bash
# Sur l'ancien ordinateur
cd d:\Jeu-mobile-adrien
git init
git add .
git commit -m "Initial commit"
git remote add origin <votre-repo-url>
git push -u origin main

# Sur le nouvel ordinateur
git clone <votre-repo-url>
cd Jeu-mobile-adrien
```

**Option B - Copie Manuelle**
- Copier tout le dossier `Jeu-mobile-adrien` sur une clé USB ou cloud
- Coller sur le nouvel ordinateur

### 2. Installer Node.js (si nécessaire)

1. Télécharger depuis : https://nodejs.org/
2. Installer la version LTS (Long Term Support)
3. Vérifier l'installation :
   ```bash
   node --version
   npm --version
   ```

### 3. Lancer le Projet

```powershell
# Naviguer vers le dossier
cd chemin\vers\Jeu-mobile-adrien

# Démarrer le serveur HTTP
powershell -ExecutionPolicy Bypass -Command "npx -y http-server -p 8000"

# Ouvrir dans le navigateur
# http://127.0.0.1:8000/index.html
```

## 🔑 Points Importants

### ⚠️ OBLIGATOIRE : Serveur HTTP

Le jeu **NE FONCTIONNE PAS** en ouvrant directement `index.html` dans le navigateur.

**Pourquoi ?** Les modules ES6 sont bloqués par la politique CORS avec le protocole `file://`.

**Solution :** Toujours utiliser un serveur HTTP local (voir commandes ci-dessus).

### 📂 Structure à Conserver

Assurez-vous que tous ces dossiers/fichiers sont présents :
```
✓ index.html
✓ css/
✓ js/
  ✓ main.js
  ✓ core/
  ✓ entities/
  ✓ systems/
  ✓ ui/
  ✓ data/
  ✓ items/
```

### 🌐 Ports Alternatifs

Si le port 8000 est déjà utilisé, essayez :
```bash
npx -y http-server -p 8080
# Puis ouvrir http://127.0.0.1:8080/index.html
```

## 🧪 Test de Fonctionnement

Après le lancement, vérifiez :

1. ✅ Le menu principal s'affiche avec 4 cartes
2. ✅ Cliquer sur "Combat" ouvre la sélection de quêtes
3. ✅ Cliquer sur "Équipe" affiche l'équipe de combat
4. ✅ Cliquer sur "Inventaire" ouvre l'interface 2 colonnes
5. ✅ Cliquer sur "Boutique" affiche la boutique

Si l'écran reste sur "Initializing..." :
- Ouvrir la console (F12)
- Vérifier les erreurs CORS
- Confirmer que le serveur HTTP est bien lancé

## 💾 Sauvegarde Recommandée

Pour éviter de perdre votre travail :

1. **Utiliser Git** (fortement recommandé)
   ```bash
   git init
   git add .
   git commit -m "Votre message"
   ```

2. **Backup Cloud**
   - OneDrive
   - Google Drive
   - Dropbox

3. **Backup Local**
   - Clé USB
   - Disque dur externe

## 🔄 Synchronisation entre Ordinateurs

### Avec Git (recommandé)

**Sur l'ordinateur 1 :**
```bash
git add .
git commit -m "Mes modifications"
git push
```

**Sur l'ordinateur 2 :**
```bash
git pull
```

### Sans Git

1. Copier le dossier complet
2. Remplacer sur l'autre ordinateur
3. ⚠️ Attention aux conflits si vous modifiez sur les deux

## 🆘 Dépannage

### Problème : "npx n'est pas reconnu"

**Solution :** Node.js n'est pas installé ou pas dans le PATH
```bash
# Vérifier
node --version

# Si erreur, réinstaller Node.js
```

### Problème : "Impossible de charger le fichier npx.ps1"

**Solution :** Politique d'exécution PowerShell
```powershell
# Utiliser la commande avec -ExecutionPolicy Bypass
powershell -ExecutionPolicy Bypass -Command "npx -y http-server -p 8000"
```

### Problème : Page blanche ou "Initializing..."

**Solutions :**
1. Vérifier que le serveur HTTP est lancé
2. Ouvrir la console (F12) pour voir les erreurs
3. Faire un hard refresh (Ctrl+Shift+R)
4. Vérifier l'URL : doit être `http://127.0.0.1:8000/index.html`

### Problème : Modifications non visibles

**Solutions :**
1. Arrêter le serveur (Ctrl+C)
2. Relancer le serveur
3. Hard refresh dans le navigateur (Ctrl+Shift+R)

## 📞 Aide Supplémentaire

Consultez le fichier `README.md` pour plus de détails sur :
- La structure du projet
- Les fonctionnalités
- Le débogage
