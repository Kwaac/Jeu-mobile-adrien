const mongoose = require('mongoose');

/**
 * Connexion à MongoDB
 * Supporte MongoDB local (dev) et MongoDB Atlas (prod)
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Options pour éviter les warnings
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        // Log différent selon l'environnement
        if (process.env.NODE_ENV === 'production') {
            console.log('🚀 Running in PRODUCTION mode');
        } else {
            console.log('🔧 Running in DEVELOPMENT mode');
        }

    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        // En développement, donner plus d'infos
        if (process.env.NODE_ENV !== 'production') {
            console.error('💡 Assurez-vous que MongoDB est lancé localement:');
            console.error('   mongod --dbpath /path/to/data');
            console.error('   ou installez MongoDB: https://www.mongodb.com/try/download/community');
        }

        process.exit(1);
    }
};

module.exports = connectDB;
