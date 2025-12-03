# Guide de Déploiement - Brave RPG

Ce guide explique comment déployer le jeu Brave RPG en production (backend + frontend).

---

## 📋 Prérequis

- Compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
- Compte [Railway](https://railway.app) ou [Render](https://render.com) (gratuit)
- Compte [GitHub](https://github.com) (pour déployer le code)

---

## 🗄️ Étape 1 : Configuration MongoDB Atlas (Base de données)

### 1.1 Créer un cluster gratuit

1. Aller sur https://www.mongodb.com/cloud/atlas
2. Créer un compte / Se connecter
3. Créer un **nouveau cluster** (M0 Sandbox - GRATUIT)
4. Choisir une région proche (ex: Europe - Frankfurt)
5. Attendre la création du cluster (~5 min)

### 1.2 Configurer l'accès

1. **Database Access** :
   - Créer un utilisateur avec mot de passe
   - Noter le username et password

2. **Network Access** :
   - Ajouter `0.0.0.0/0` (autoriser toutes les IPs)
   - ⚠️ En production réelle, restreindre aux IPs du serveur

### 1.3 Obtenir la connection string

1. Cliquer sur **Connect** sur votre cluster
2. Choisir **Connect your application**
3. Copier la connection string :
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/brave_rpg?retryWrites=true&w=majority
   ```
4. Remplacer `<password>` par votre mot de passe
5. Remplacer `brave_rpg` par le nom de votre base de données

---

## 🚀 Étape 2 : Déployer le Backend (Railway ou Render)

### Option A : Railway (Recommandé - Plus simple)

#### 2.1 Préparer le code

1. Créer un repo GitHub avec le dossier `server-backend/`
2. Ajouter un fichier `Procfile` dans `server-backend/` :
   ```
   web: node server.js
   ```

#### 2.2 Déployer sur Railway

1. Aller sur https://railway.app
2. Se connecter avec GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Sélectionner votre repo
5. Configurer les variables d'environnement :
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `MONGODB_URI` = (votre connection string MongoDB Atlas)
   - `JWT_SECRET` = (générer un secret aléatoire fort)
   - `JWT_EXPIRE` = `7d`
   - `CLIENT_URL` = (URL de votre frontend - voir étape 3)

6. Railway déploie automatiquement !
7. Noter l'URL du backend (ex: `https://votre-app.up.railway.app`)

---

### Option B : Render

#### 2.1 Préparer le code

Même chose que Railway (repo GitHub + Procfile)

#### 2.2 Déployer sur Render

1. Aller sur https://render.com
2. Se connecter avec GitHub
3. **New** → **Web Service**
4. Connecter votre repo GitHub
5. Configuration :
   - **Name** : `brave-rpg-backend`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Plan** : Free

6. Ajouter les variables d'environnement (même liste que Railway)
7. Cliquer sur **Create Web Service**
8. Noter l'URL du backend (ex: `https://brave-rpg-backend.onrender.com`)

---

## 🌐 Étape 3 : Déployer le Frontend

### Option A : GitHub Pages (Gratuit)

#### 3.1 Préparer le code

1. Dans `js/systems/OnlineSystem.js`, changer l'URL de l'API :
   ```javascript
   this.apiUrl = 'https://VOTRE-BACKEND-URL.com/api';
   ```

2. Créer un fichier `.nojekyll` à la racine du projet (pour GitHub Pages)

#### 3.2 Déployer

1. Push le code sur GitHub
2. Aller dans **Settings** → **Pages**
3. Source : **Deploy from a branch**
4. Branch : `main` / `master`
5. Folder : `/` (root)
6. Sauvegarder

7. Votre jeu sera accessible sur :
   ```
   https://votre-username.github.io/Jeu-mobile-adrien/
   ```

---

### Option B : Netlify (Gratuit + Plus simple)

1. Aller sur https://www.netlify.com
2. Se connecter avec GitHub
3. **Add new site** → **Import an existing project**
4. Sélectionner votre repo
5. Configuration :
   - **Build command** : (laisser vide)
   - **Publish directory** : `/`
6. Déployer !

7. Netlify vous donne une URL : `https://votre-app.netlify.app`

---

## 🔧 Étape 4 : Configuration Finale

### 4.1 Mettre à jour CLIENT_URL dans le backend

1. Retourner sur Railway/Render
2. Modifier la variable `CLIENT_URL` avec l'URL de votre frontend
3. Redéployer le backend

### 4.2 Tester la connexion

1. Ouvrir votre jeu (URL frontend)
2. Ouvrir la console (F12)
3. Vérifier qu'il n'y a pas d'erreurs CORS
4. Tester l'inscription/connexion

---

## ✅ Checklist de Déploiement

- [ ] MongoDB Atlas configuré
- [ ] Backend déployé sur Railway/Render
- [ ] Variables d'environnement configurées
- [ ] Frontend déployé sur GitHub Pages/Netlify
- [ ] `apiUrl` mis à jour dans `OnlineSystem.js`
- [ ] `CLIENT_URL` mis à jour dans le backend
- [ ] Test d'inscription fonctionnel
- [ ] Test de connexion fonctionnel
- [ ] Test de sauvegarde cloud fonctionnel
- [ ] Test de PVP fonctionnel

---

## 🐛 Troubleshooting

### Erreur CORS

**Problème** : `Access to fetch at ... has been blocked by CORS policy`

**Solution** : Vérifier que `CLIENT_URL` dans le backend correspond exactement à l'URL du frontend

---

### Backend ne démarre pas

**Problème** : `Application failed to respond`

**Solution** : 
1. Vérifier les logs sur Railway/Render
2. Vérifier que `MONGODB_URI` est correct
3. Vérifier que toutes les variables d'environnement sont définies

---

### MongoDB Connection Error

**Problème** : `MongooseServerSelectionError`

**Solution** :
1. Vérifier la connection string MongoDB Atlas
2. Vérifier que l'IP `0.0.0.0/0` est autorisée dans Network Access
3. Vérifier que le mot de passe ne contient pas de caractères spéciaux (ou les encoder)

---

## 📊 Monitoring

### Railway

- **Logs** : Onglet "Deployments" → Cliquer sur le déploiement
- **Metrics** : Onglet "Metrics" (CPU, RAM, Network)

### Render

- **Logs** : Onglet "Logs" en temps réel
- **Metrics** : Dashboard principal

### MongoDB Atlas

- **Metrics** : Onglet "Metrics" du cluster
- **Logs** : Onglet "Logs"

---

## 💰 Coûts

- **MongoDB Atlas M0** : GRATUIT (512 MB storage)
- **Railway** : GRATUIT ($5 de crédit/mois)
- **Render** : GRATUIT (avec limitations)
- **GitHub Pages** : GRATUIT
- **Netlify** : GRATUIT (100 GB bandwidth/mois)

**Total : 0€/mois** pour commencer ! 🎉

---

## 🔒 Sécurité en Production

### À faire absolument :

1. **Changer JWT_SECRET** : Générer un secret fort
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Restreindre CORS** : Ne pas laisser `*`, utiliser l'URL exacte du frontend

3. **Restreindre MongoDB Network Access** : Autoriser uniquement les IPs du serveur backend

4. **HTTPS** : Railway/Render/Netlify fournissent HTTPS automatiquement ✅

5. **Rate Limiting** : Déjà implémenté dans le code ✅

---

## 📞 Support

En cas de problème :
1. Vérifier les logs du backend
2. Vérifier la console du navigateur (F12)
3. Vérifier que toutes les URLs sont correctes
4. Tester l'endpoint `/health` du backend : `https://votre-backend.com/health`

---

Bon déploiement ! 🚀
