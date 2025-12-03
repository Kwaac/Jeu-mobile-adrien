/**
 * OnlineSystem - Gestion de la connexion au backend et synchronisation cloud
 * 
 * Fonctionnalités :
 * - Authentification JWT
 * - Synchronisation cloud des sauvegardes
 * - Gestion mode offline/online
 * - Retry automatique en cas d'erreur réseau
 */

export default class OnlineSystem {
    constructor(game) {
        this.game = game;
        this.apiUrl = 'http://localhost:3000/api'; // À changer en prod
        this.token = null;
        this.isOnline = false;
        this.user = null;

        // Charger le token depuis localStorage
        this.loadToken();

        console.log('[OnlineSystem] Initialized');
    }

    /**
     * Charge le token JWT depuis localStorage
     */
    loadToken() {
        const savedToken = localStorage.getItem('tdwt_token');
        if (savedToken) {
            this.token = savedToken;
            this.isOnline = true;
            console.log('[OnlineSystem] Token loaded from storage');
        }
    }

    /**
     * Sauvegarde le token JWT dans localStorage
     */
    saveToken(token) {
        this.token = token;
        localStorage.setItem('tdwt_token', token);
        this.isOnline = true;
    }

    /**
     * Supprime le token (déconnexion)
     */
    clearToken() {
        this.token = null;
        this.user = null;
        this.isOnline = false;
        localStorage.removeItem('tdwt_token');
    }

    /**
     * Inscription d'un nouveau compte
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     */
    async register(username, email, password) {
        try {
            const playerId = this.game.saveSystem.getOrCreatePlayerId();

            const response = await fetch(`${this.apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, playerId })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            // Sauvegarder le token
            this.saveToken(data.data.token);
            this.user = data.data.user;

            console.log('[OnlineSystem] Registration successful:', this.user.username);

            // Activer la sync cloud dans SaveSystem
            this.game.saveSystem.enableCloudSync(this);

            // Sync initiale
            await this.syncToCloud();

            return { success: true, user: this.user };

        } catch (error) {
            console.error('[OnlineSystem] Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Connexion
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Erreur lors de la connexion');
            }

            // Sauvegarder le token
            this.saveToken(data.data.token);
            this.user = data.data.user;

            console.log('[OnlineSystem] Login successful:', this.user.username);

            // Activer la sync cloud
            this.game.saveSystem.enableCloudSync(this);

            // Merger avec la sauvegarde cloud
            await this.mergeWithCloudSave();

            return { success: true, user: this.user };

        } catch (error) {
            console.error('[OnlineSystem] Login error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Déconnexion
     */
    async logout() {
        try {
            // Sauvegarder avant de se déconnecter
            await this.syncToCloud();

            // Appeler l'API de logout (optionnel)
            if (this.token) {
                await fetch(`${this.apiUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }

            // Nettoyer
            this.clearToken();
            this.game.saveSystem.disableCloudSync();

            console.log('[OnlineSystem] Logout successful');
            return { success: true };

        } catch (error) {
            console.error('[OnlineSystem] Logout error:', error);
            // Nettoyer quand même
            this.clearToken();
            this.game.saveSystem.disableCloudSync();
            return { success: false, error: error.message };
        }
    }

    /**
     * Synchronise la sauvegarde locale vers le cloud
     */
    async syncToCloud() {
        if (!this.isOnline || !this.token) {
            console.log('[OnlineSystem] Not online, skipping cloud sync');
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const saveData = this.game.saveSystem.serialize();

            const response = await fetch(`${this.apiUrl}/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(saveData)
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Erreur lors de la sync cloud');
            }

            console.log('[OnlineSystem] Cloud sync successful');
            return { success: true, data: data.data };

        } catch (error) {
            console.error('[OnlineSystem] Cloud sync error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Récupère la sauvegarde depuis le cloud
     */
    async getCloudSave() {
        if (!this.isOnline || !this.token) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const response = await fetch(`${this.apiUrl}/save`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Erreur lors de la récupération cloud');
            }

            console.log('[OnlineSystem] Cloud save retrieved');
            return { success: true, data: data.data };

        } catch (error) {
            console.error('[OnlineSystem] Get cloud save error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Merge la sauvegarde locale avec la cloud
     */
    async mergeWithCloudSave() {
        if (!this.isOnline || !this.token) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const localSave = this.game.saveSystem.serialize();

            const response = await fetch(`${this.apiUrl}/save/merge`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ localSave })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Erreur lors du merge');
            }

            console.log('[OnlineSystem] Merge result:', data.action);

            if (data.action === 'use_cloud') {
                // Utiliser la sauvegarde cloud
                this.game.saveSystem.deserialize(data.data);
                console.log('[OnlineSystem] Cloud save loaded (more recent)');
            } else {
                // Utiliser la sauvegarde locale et sync
                await this.syncToCloud();
                console.log('[OnlineSystem] Local save used (more recent)');
            }

            return { success: true, action: data.action };

        } catch (error) {
            console.error('[OnlineSystem] Merge error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isAuthenticated() {
        return this.isOnline && this.token !== null;
    }

    /**
     * Obtient les infos de l'utilisateur
     */
    getUser() {
        return this.user;
    }

    /**
     * Requête API générique avec gestion d'erreur
     */
    async apiRequest(endpoint, options = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'API request failed');
            }

            return { success: true, data: data.data };

        } catch (error) {
            console.error(`[OnlineSystem] API request error (${endpoint}):`, error);
            return { success: false, error: error.message };
        }
    }
}
