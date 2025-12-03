require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Initialiser Express
const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://127.0.0.1:8080',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple pour développement
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/save', require('./routes/save'));
app.use('/api/pvp', require('./routes/pvp'));

// Route de test
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'The Dying World Tree API - Server is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            save: '/api/save',
            pvp: '/api/pvp'
        }
    });
});

// Route de health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur serveur',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🌳  THE DYING WORLD TREE - Backend API Server');
    console.log('═══════════════════════════════════════════════════');
    console.log(`🚀  Server running on port ${PORT}`);
    console.log(`🌐  API URL: http://localhost:${PORT}`);
    console.log(`📡  Client URL: ${process.env.CLIENT_URL}`);
    console.log(`🔧  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('📚  Available endpoints:');
    console.log(`   POST   /api/auth/register    - Créer un compte`);
    console.log(`   POST   /api/auth/login       - Se connecter`);
    console.log(`   GET    /api/save             - Récupérer sauvegarde`);
    console.log(`   POST   /api/save             - Sauvegarder`);
    console.log(`   POST   /api/save/merge       - Merger sauvegardes`);
    console.log(`   GET    /api/pvp/matchmaking  - Trouver adversaire`);
    console.log(`   POST   /api/pvp/battle-result - Soumettre résultat`);
    console.log(`   GET    /api/pvp/leaderboard  - Classement`);
    console.log('');
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
    console.log('SIGTERM reçu, arrêt gracieux...');
    server.close(() => {
        console.log('Serveur fermé');
        process.exit(0);
    });
});

module.exports = app;
