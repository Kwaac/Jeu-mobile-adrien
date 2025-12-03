const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schéma User - Authentification et profil joueur
 */
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username requis'],
        unique: true,
        trim: true,
        minlength: [3, 'Username minimum 3 caractères'],
        maxlength: [20, 'Username maximum 20 caractères']
    },
    email: {
        type: String,
        required: [true, 'Email requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: [true, 'Password requis'],
        minlength: [6, 'Password minimum 6 caractères'],
        select: false // Ne pas retourner le password par défaut
    },
    playerId: {
        type: String,
        required: true,
        unique: true
    },

    // Stats PVP
    pvpStats: {
        rating: { type: Number, default: 1000 }, // ELO rating
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        draws: { type: Number, default: 0 },
        winStreak: { type: Number, default: 0 },
        bestRating: { type: Number, default: 1000 }
    },

    // Métadonnées
    lastLogin: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isOnline: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash password avant sauvegarde
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour comparer les passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour obtenir le profil public (pour PVP)
UserSchema.methods.getPublicProfile = function () {
    return {
        username: this.username,
        playerId: this.playerId,
        pvpStats: this.pvpStats,
        lastLogin: this.lastLogin
    };
};

module.exports = mongoose.model('User', UserSchema);
