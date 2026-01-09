/**
 * PVPSystem - Système de combat PVP asynchrone
 * 
 * Fonctionnalités :
 * - Matchmaking basé sur le rating ELO
 * - Combat contre l'équipe d'un autre joueur (contrôlée par IA)
 * - Système de classement
 * - Récompenses PVP
 */

export default class PVPSystem {
    constructor(game) {
        this.game = game;
        this.currentOpponent = null;
        this.opponentTeam = [];
        this.battleResult = null;

        console.log('[PVPSystem] Initialized');
    }

    /**
     * Recherche un adversaire via matchmaking
     */
    async findOpponent() {
        if (!this.game.onlineSystem.isAuthenticated()) {
            console.error('[PVPSystem] Not authenticated');
            return { success: false, error: 'Vous devez être connecté pour jouer en PVP' };
        }

        try {
            const result = await this.game.onlineSystem.apiRequest('/pvp/matchmaking', {
                method: 'GET'
            });

            if (!result.success) {
                throw new Error(result.error || 'Matchmaking failed');
            }

            this.currentOpponent = result.data.opponent;
            this.opponentTeam = result.data.team;

            console.log('[PVPSystem] Opponent found:', this.currentOpponent.username);
            console.log('[PVPSystem] Opponent rating:', this.currentOpponent.rating);
            console.log('[PVPSystem] Opponent team size:', this.opponentTeam.length);

            return {
                success: true,
                opponent: this.currentOpponent,
                team: this.opponentTeam
            };

        } catch (error) {
            console.error('[PVPSystem] Matchmaking error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Démarre un combat PVP
     */
    async startPVPBattle() {
        if (!this.currentOpponent || !this.opponentTeam.length) {
            return { success: false, error: 'Aucun adversaire trouvé' };
        }

        try {
            // Créer les unités ennemies depuis les données de l'adversaire
            const enemyUnits = this.opponentTeam.map(unitData => {
                // Importer Unit dynamiquement
                return import('../entities/Unit.js').then(({ default: Unit }) => {
                    const unit = new Unit(unitData.name, false, unitData);

                    // Restaurer tous les stats
                    unit.instanceId = unitData.instanceId;
                    unit.hp = unitData.hp;
                    unit.maxHp = unitData.maxHp;
                    unit.atk = unitData.atk;
                    unit.def = unitData.def;
                    unit.level = unitData.level;
                    unit.currentRarity = unitData.currentRarity;
                    unit.bbGauge = 0; // Reset BB gauge pour le combat

                    return unit;
                });
            });

            // Attendre que toutes les unités soient créées
            const resolvedEnemies = await Promise.all(enemyUnits);

            // Démarrer le combat via BattleSystem
            this.game.battleSystem.startPVPWave(resolvedEnemies);
            this.game.startBattle();

            console.log('[PVPSystem] PVP Battle started against', this.currentOpponent.username);

            return { success: true };

        } catch (error) {
            console.error('[PVPSystem] Start battle error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Soumet le résultat du combat PVP
     * @param {string} result - 'win', 'loss', ou 'draw'
     */
    async submitBattleResult(result) {
        if (!this.currentOpponent) {
            return { success: false, error: 'Aucun combat en cours' };
        }

        if (!this.game.onlineSystem.isAuthenticated()) {
            return { success: false, error: 'Non authentifié' };
        }

        try {
            const response = await this.game.onlineSystem.apiRequest('/pvp/battle-result', {
                method: 'POST',
                body: JSON.stringify({
                    opponentPlayerId: this.currentOpponent.playerId,
                    result: result,
                    battleLog: null // Optionnel : ajouter un log de combat plus tard
                })
            });

            if (!response.success) {
                throw new Error(response.error || 'Failed to submit result');
            }

            this.battleResult = response.data;

            console.log('[PVPSystem] Battle result submitted:', result);
            console.log('[PVPSystem] Rating change:', response.data.ratingChange);
            console.log('[PVPSystem] New rating:', response.data.newRating);

            // Appliquer les récompenses
            if (response.data.rewards) {
                if (response.data.rewards.gold > 0) {
                    this.game.economySystem.earnGold(response.data.rewards.gold);
                }

                if (response.data.rewards.gems > 0) {
                    this.game.economySystem.buyGems(response.data.rewards.gems);
                }
            }

            // Sauvegarder
            this.game.triggerSave();

            return { success: true, data: response.data };

        } catch (error) {
            console.error('[PVPSystem] Submit result error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Récupère le classement PVP
     * @param {number} page - Page du classement (1-indexed)
     * @param {number} limit - Nombre de résultats par page
     */
    async getLeaderboard(page = 1, limit = 100) {
        if (!this.game.onlineSystem.isAuthenticated()) {
            return { success: false, error: 'Non authentifié' };
        }

        try {
            const response = await this.game.onlineSystem.apiRequest(
                `/pvp/leaderboard?page=${page}&limit=${limit}`,
                { method: 'GET' }
            );

            if (!response.success) {
                throw new Error(response.error || 'Failed to get leaderboard');
            }

            console.log('[PVPSystem] Leaderboard retrieved');
            console.log('[PVPSystem] Your rank:', response.data.currentUserRank);

            return { success: true, data: response.data };

        } catch (error) {
            console.error('[PVPSystem] Leaderboard error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtient les stats PVP du joueur actuel
     */
    getPVPStats() {
        if (!this.game.onlineSystem.isAuthenticated()) {
            return null;
        }

        const user = this.game.onlineSystem.getUser();
        return user ? user.pvpStats : null;
    }

    /**
     * Nettoie l'état du combat PVP
     */
    reset() {
        this.currentOpponent = null;
        this.opponentTeam = [];
        this.battleResult = null;
    }

    /**
     * Obtient l'adversaire actuel
     */
    getCurrentOpponent() {
        return this.currentOpponent;
    }

    /**
     * Obtient le résultat du dernier combat
     */
    getLastBattleResult() {
        return this.battleResult;
    }
}
