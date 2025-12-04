/**
 * SaveSystem - Gestion de la sauvegarde locale et future synchronisation cloud
 * 
 * Architecture préparée pour :
 * - Phase 1 : Sauvegarde locale (LocalStorage)
 * - Phase 2 : Synchronisation cloud (via OnlineSystem)
 * - Phase 3 : Support PVP asynchrone et temps réel
 */

export default class SaveSystem {
    constructor(game) {
        this.game = game;
        this.saveKey = 'tdwt_save';
        this.version = '1.0.0';
        this.autoSaveInterval = 30000; // 30 secondes
        this.autoSaveTimer = null;

        // Flags pour future intégration online
        this.cloudSyncEnabled = false; // Sera activé avec OnlineSystem
        this.pendingCloudSync = false;

        console.log('[SaveSystem] Initialized');
    }

    /**
     * Démarre l'auto-save périodique
     */
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }

        this.autoSaveTimer = setInterval(() => {
            this.save();
            console.log('[SaveSystem] Auto-save triggered');
        }, this.autoSaveInterval);

        console.log(`[SaveSystem] Auto-save started (every ${this.autoSaveInterval / 1000}s)`);
    }

    /**
     * Arrête l'auto-save
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log('[SaveSystem] Auto-save stopped');
        }
    }

    /**
     * Sérialise l'état complet du jeu
     * @returns {Object} État du jeu en JSON
     */
    serialize() {
        const saveData = {
            version: this.version,
            timestamp: Date.now(),
            playerId: this.getOrCreatePlayerId(), // Pour future sync cloud

            // Données économiques
            economy: this.game.economySystem.toJSON(),

            // Données de l'équipe et unités
            party: this.game.partyManager.toJSON(),

            // Progression de l'histoire
            story: this.game.storySystem.toJSON(),

            // Village et crafting
            village: this.game.villageSystem.toJSON(),
            crafting: this.game.craftingSystem.toJSON(),

            // Métadonnées pour future expansion
            metadata: {
                lastSave: new Date().toISOString(),
                gameState: this.game.state,
                totalPlayTime: 0 // À implémenter plus tard
            }
        };

        return saveData;
    }

    /**
     * Désérialise et restaure l'état du jeu
     * @param {Object} data - Données sauvegardées
     */
    deserialize(data) {
        try {
            // Vérification de version (pour migrations futures)
            if (data.version !== this.version) {
                console.warn(`[SaveSystem] Version mismatch: ${data.version} -> ${this.version}`);
                // Ici on pourrait ajouter des migrations de données
            }

            // Restaurer les systèmes
            if (data.economy) {
                this.game.economySystem.fromJSON(data.economy);
            }

            if (data.party) {
                this.game.partyManager.fromJSON(data.party);
            }

            // Support ancien format (quests) et nouveau format (story)
            if (data.story) {
                this.game.storySystem.fromJSON(data.story);
            } else if (data.quests) {
                // Migration depuis l'ancien système de quêtes
                console.log('[SaveSystem] Migrating from old quest system');
                this.game.storySystem.fromJSON(null); // Initialise avec valeurs par défaut
            }

            // Restaurer le village et le crafting
            if (data.village) {
                this.game.villageSystem.fromJSON(data.village);
            }

            if (data.crafting) {
                this.game.craftingSystem.fromJSON(data.crafting);
            }

            console.log('[SaveSystem] Game state restored successfully');
            return true;

        } catch (error) {
            console.error('[SaveSystem] Error deserializing save data:', error);
            return false;
        }
    }

    /**
     * Sauvegarde dans LocalStorage
     * (Future: déclenchera aussi la sync cloud si activée)
     */
    save() {
        try {
            const saveData = this.serialize();
            const jsonString = JSON.stringify(saveData);

            // Sauvegarde locale
            localStorage.setItem(this.saveKey, jsonString);

            // Log de la taille pour monitoring
            const sizeKB = (jsonString.length / 1024).toFixed(2);
            console.log(`[SaveSystem] Saved locally (${sizeKB} KB)`);

            // Future: Sync cloud si activé
            if (this.cloudSyncEnabled && this.game.onlineSystem) {
                this.pendingCloudSync = true;
                this.game.onlineSystem.syncToCloud(saveData);
            }

            return true;

        } catch (error) {
            console.error('[SaveSystem] Error saving game:', error);

            // Vérifier si LocalStorage est plein
            if (error.name === 'QuotaExceededError') {
                alert('Espace de sauvegarde insuffisant. Veuillez libérer de l\'espace.');
            }

            return false;
        }
    }

    /**
     * Charge depuis LocalStorage
     * (Future: mergera avec les données cloud si disponibles)
     */
    load() {
        try {
            const jsonString = localStorage.getItem(this.saveKey);

            if (!jsonString) {
                console.log('[SaveSystem] No save found, starting fresh');
                return false;
            }

            const saveData = JSON.parse(jsonString);
            const success = this.deserialize(saveData);

            if (success) {
                const saveDate = new Date(saveData.timestamp);
                console.log(`[SaveSystem] Game loaded successfully (saved: ${saveDate.toLocaleString()})`);
            }

            // Future: Vérifier et merger avec cloud save
            if (this.cloudSyncEnabled && this.game.onlineSystem) {
                this.game.onlineSystem.mergeWithCloudSave(saveData);
            }

            return success;

        } catch (error) {
            console.error('[SaveSystem] Error loading game:', error);

            // En cas d'erreur, proposer de réinitialiser
            const reset = confirm('Erreur de chargement. Voulez-vous réinitialiser la sauvegarde ?');
            if (reset) {
                this.reset();
            }

            return false;
        }
    }

    /**
     * Réinitialise la sauvegarde
     */
    reset() {
        localStorage.removeItem(this.saveKey);
        console.log('[SaveSystem] Save data reset');

        // Recharger la page pour repartir de zéro
        if (confirm('Sauvegarde réinitialisée. Recharger la page ?')) {
            window.location.reload();
        }
    }

    /**
     * Exporte la sauvegarde en fichier JSON (pour backup manuel)
     */
    exportToFile() {
        const saveData = this.serialize();
        const jsonString = JSON.stringify(saveData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `tdwt_save_${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        console.log('[SaveSystem] Save exported to file');
    }

    /**
     * Importe une sauvegarde depuis un fichier JSON
     * @param {File} file - Fichier JSON à importer
     */
    importFromFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const saveData = JSON.parse(e.target.result);
                const success = this.deserialize(saveData);

                if (success) {
                    this.save(); // Sauvegarder immédiatement
                    alert('Sauvegarde importée avec succès !');
                    window.location.reload();
                } else {
                    alert('Erreur lors de l\'importation de la sauvegarde.');
                }
            } catch (error) {
                console.error('[SaveSystem] Import error:', error);
                alert('Fichier de sauvegarde invalide.');
            }
        };

        reader.readAsText(file);
    }

    /**
     * Obtient ou crée un ID joueur unique (pour future sync cloud)
     * @returns {string} Player ID
     */
    getOrCreatePlayerId() {
        let playerId = localStorage.getItem('tdwt_player_id');

        if (!playerId) {
            // Générer un UUID simple
            playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('tdwt_player_id', playerId);
            console.log('[SaveSystem] New player ID created:', playerId);
        }

        return playerId;
    }

    /**
     * Active la synchronisation cloud (appelé par OnlineSystem)
     * @param {OnlineSystem} onlineSystem - Référence au système online
     */
    enableCloudSync(onlineSystem) {
        this.cloudSyncEnabled = true;
        console.log('[SaveSystem] Cloud sync enabled');
    }

    /**
     * Désactive la synchronisation cloud
     */
    disableCloudSync() {
        this.cloudSyncEnabled = false;
        this.pendingCloudSync = false;
        console.log('[SaveSystem] Cloud sync disabled');
    }

    /**
     * Vérifie si une sauvegarde existe
     * @returns {boolean}
     */
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    /**
     * Obtient les informations de la sauvegarde sans la charger
     * @returns {Object|null}
     */
    getSaveInfo() {
        try {
            const jsonString = localStorage.getItem(this.saveKey);
            if (!jsonString) return null;

            const saveData = JSON.parse(jsonString);
            return {
                version: saveData.version,
                timestamp: saveData.timestamp,
                date: new Date(saveData.timestamp).toLocaleString(),
                playerId: saveData.playerId,
                sizeKB: (jsonString.length / 1024).toFixed(2)
            };
        } catch (error) {
            console.error('[SaveSystem] Error reading save info:', error);
            return null;
        }
    }
}
