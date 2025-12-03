# Brave RPG - Backend API

Backend Node.js/Express pour le jeu mobile Brave RPG.

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** (v16 ou supérieur)
- **MongoDB** (local ou MongoDB Atlas)

### Installation

```bash
# Installer les dépendances
npm install
```

### Configuration

1. Copier `.env` et ajuster les variables si nécessaire
2. **MongoDB Local** : Assurez-vous que MongoDB tourne localement sur le port 27017
3. **MongoDB Atlas** (production) : Remplacer `MONGODB_URI` dans `.env`

### Lancement

```bash
# Développement (avec auto-reload)
npm run dev

# Production
npm start
```

Le serveur démarre sur **http://localhost:3000**

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter

### Save Sync

- `GET /api/save` - Récupérer sauvegarde cloud (Auth requise)
- `POST /api/save` - Sauvegarder dans le cloud (Auth requise)
- `POST /api/save/merge` - Merger local/cloud (Auth requise)

### PVP

- `GET /api/pvp/matchmaking` - Trouver un adversaire (Auth requise)
- `POST /api/pvp/battle-result` - Soumettre résultat combat (Auth requise)
- `GET /api/pvp/leaderboard` - Classement PVP (Auth requise)

---

## 🔐 Authentification

Utilise **JWT (JSON Web Tokens)**.

### Exemple de requête authentifiée :

```javascript
fetch('http://localhost:3000/api/save', {
    headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN',
        'Content-Type': 'application/json'
    }
})
```

---

## 🗄️ Structure de la Base de Données

### Collection `users`

```javascript
{
    username: String,
    email: String,
    password: String (hashed),
    playerId: String,
    pvpStats: {
        rating: Number,
        wins: Number,
        losses: Number,
        draws: Number,
        winStreak: Number,
        bestRating: Number
    },
    lastLogin: Date,
    createdAt: Date
}
```

### Collection `playerdatas`

```javascript
{
    playerId: String,
    version: String,
    economy: { resources, inventory },
    party: { ownedUnits, partyInstanceIds },
    quests: { activeQuestId, currentWave },
    metadata: { lastSave, gameState, totalPlayTime },
    pvpDefenseTeam: Array
}
```

---

## 🚀 Migration vers Production

### Option 1 : MongoDB Atlas (Recommandé)

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Obtenir la connection string
4. Mettre à jour `.env` :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brave_rpg
   ```

### Option 2 : Hébergement Backend

**Railway.app** (Gratuit) :
1. Créer un compte sur [Railway](https://railway.app)
2. Connecter le repo GitHub
3. Ajouter les variables d'environnement
4. Déployer automatiquement

**Render.com** (Gratuit) :
1. Créer un compte sur [Render](https://render.com)
2. Créer un nouveau Web Service
3. Connecter le repo
4. Configurer les variables d'environnement

### Variables d'environnement pour Production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=CHANGER_CE_SECRET_EN_PROD
JWT_EXPIRE=7d
CLIENT_URL=https://votre-domaine.com
```

---

## 🧪 Tests

```bash
# Test de santé
curl http://localhost:3000/health

# Test de création de compte
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456","playerId":"player_123"}'
```

---

## 📝 Notes de Développement

- Les passwords sont automatiquement hashés avec bcrypt
- Les tokens JWT expirent après 7 jours par défaut
- Le système ELO pour PVP utilise un facteur K de 32
- Le matchmaking cherche des adversaires dans une plage de ±200 rating

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Problème** : `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution** : Lancer MongoDB localement :
```bash
mongod --dbpath /path/to/data
```

Ou installer MongoDB : https://www.mongodb.com/try/download/community

### Port Already in Use

**Problème** : `Error: listen EADDRINUSE: address already in use :::3000`

**Solution** : Changer le port dans `.env` ou arrêter le processus :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

---

## 📄 Licence

Projet personnel - Tous droits réservés
