import { getAllZones, getZoneData, generateZoneStages } from '../data/StoryZones.js';

export default class StorySystem {
    constructor(game) {
        this.game = game;

        // État actuel
        this.currentZoneId = null;
        this.currentStageId = null;
        this.activeStage = null;
        this.currentWave = 0;

        // Progression du joueur
        this.zoneProgress = {}; // { zoneId: { completed: bool, bossDefeated: bool } }
        this.stageProgress = {}; // { 'zoneId_stageId': { completed: bool, unlocked: bool } }

        // Initialiser la progression pour la zone 1
        this.initializeProgress();
    }

    /**
     * Initialise la progression par défaut (Zone 1, Étape 1 débloquée)
     */
    initializeProgress() {
        // Zone 1 débloquée par défaut
        this.zoneProgress[1] = { completed: false, bossDefeated: false };

        // Étape 1 de la zone 1 débloquée
        this.stageProgress['1_1'] = { completed: false, unlocked: true };

        console.log('[StorySystem] Progression initialisée - Zone 1, Étape 1 débloquée');
    }

    /**
     * Vérifie si une zone est débloquée
     */
    isZoneUnlocked(zoneId) {
        if (zoneId === 1) return true; // Zone 1 toujours débloquée

        // Une zone est débloquée si le boss de la zone précédente est vaincu
        const previousZoneProgress = this.zoneProgress[zoneId - 1];
        return previousZoneProgress && previousZoneProgress.bossDefeated;
    }

    /**
     * Vérifie si une étape est débloquée
     */
    isStageUnlocked(zoneId, stageId) {
        const key = `${zoneId}_${stageId}`;

        // Vérifier si l'étape existe dans le progress
        if (this.stageProgress[key]) {
            return this.stageProgress[key].unlocked;
        }

        // Si pas dans le progress, c'est qu'elle n'est pas débloquée
        return false;
    }

    /**
     * Récupère les données d'une zone
     */
    getZoneData(zoneId) {
        return getZoneData(zoneId);
    }

    /**
     * Récupère toutes les zones avec leur statut de déverrouillage
     */
    getAllZonesWithStatus() {
        const zones = getAllZones();
        return zones.map(zone => ({
            ...zone,
            unlocked: this.isZoneUnlocked(zone.id),
            progress: this.zoneProgress[zone.id] || { completed: false, bossDefeated: false }
        }));
    }

    /**
     * Récupère toutes les étapes d'une zone avec leur statut
     */
    getZoneStagesWithStatus(zoneId) {
        const stages = generateZoneStages(zoneId);
        if (!stages) return null;

        return stages.map(stage => ({
            ...stage,
            unlocked: this.isStageUnlocked(zoneId, stage.stageId),
            completed: this.stageProgress[`${zoneId}_${stage.stageId}`]?.completed || false
        }));
    }

    /**
     * Démarre une étape spécifique
     */
    startStage(zoneId, stageId) {
        console.log(`[StorySystem] Tentative de démarrage - Zone ${zoneId}, Étape ${stageId}`);

        // Vérifier que la zone est débloquée
        if (!this.isZoneUnlocked(zoneId)) {
            console.error(`Zone ${zoneId} non débloquée`);
            return false;
        }

        // Vérifier que l'étape est débloquée
        if (!this.isStageUnlocked(zoneId, stageId)) {
            console.error(`Étape ${stageId} de la zone ${zoneId} non débloquée`);
            return false;
        }

        // Récupérer les données de l'étape
        const stages = generateZoneStages(zoneId);
        const stage = stages.find(s => s.stageId === stageId);

        if (!stage) {
            console.error(`Étape ${stageId} non trouvée dans la zone ${zoneId}`);
            return false;
        }

        // Vérifier l'énergie (TODO: implémenter le système d'énergie)
        // Pour l'instant, on suppose que le joueur a assez d'énergie

        // Démarrer l'étape
        this.currentZoneId = zoneId;
        this.currentStageId = stageId;
        this.activeStage = stage;
        this.currentWave = 0;

        console.log(`[StorySystem] Démarrage - ${stage.name}`);
        console.log(`[StorySystem] Énergie requise: ${stage.energyCost}`);

        // Lancer la première vague de combat
        this.game.battleSystem.startWave(this.activeStage.waves[0]);

        return true;
    }

    /**
     * Passe à la vague suivante (appelé par le système de combat)
     */
    nextWave() {
        if (!this.activeStage) return;

        this.currentWave++;
        if (this.currentWave < this.activeStage.waves.length) {
            console.log(`[StorySystem] Vague ${this.currentWave + 1}/${this.activeStage.waves.length}`);
            this.game.battleSystem.startWave(this.activeStage.waves[this.currentWave]);
        } else {
            this.completeStage();
        }
    }

    /**
     * Complète l'étape actuelle
     */
    completeStage() {
        if (!this.activeStage) return;

        console.log(`[StorySystem] Étape terminée : ${this.activeStage.name}`);

        const zoneId = this.currentZoneId;
        const stageId = this.currentStageId;
        const isBoss = this.activeStage.isBoss;

        // Distribuer les récompenses
        this.distributeRewards(this.activeStage.rewards);

        // Marquer l'étape comme complétée
        const stageKey = `${zoneId}_${stageId}`;
        if (!this.stageProgress[stageKey]) {
            this.stageProgress[stageKey] = { unlocked: true, completed: false };
        }
        this.stageProgress[stageKey].completed = true;

        // Si c'est un boss
        if (isBoss) {
            this.completeBoss(zoneId);
        } else {
            // Débloquer l'étape suivante
            this.unlockNextStage(zoneId, stageId);
        }

        // Sauvegarder la progression
        this.game.saveSystem.save();

        // Réinitialiser l'état actuel
        this.activeStage = null;
        this.currentZoneId = null;
        this.currentStageId = null;
        this.currentWave = 0;

        // Terminer le combat
        this.game.endBattle(true); // true = victoire
    }

    /**
     * Complète le boss d'une zone et débloque la zone suivante
     */
    completeBoss(zoneId) {
        console.log(`[StorySystem] Boss de la zone ${zoneId} vaincu !`);

        // Marquer le boss comme vaincu
        if (!this.zoneProgress[zoneId]) {
            this.zoneProgress[zoneId] = { completed: false, bossDefeated: false };
        }
        this.zoneProgress[zoneId].bossDefeated = true;
        this.zoneProgress[zoneId].completed = true;

        // Débloquer la zone suivante
        const nextZoneId = zoneId + 1;
        if (nextZoneId <= 7) {
            console.log(`[StorySystem] Zone ${nextZoneId} débloquée !`);

            // Initialiser la progression de la nouvelle zone
            if (!this.zoneProgress[nextZoneId]) {
                this.zoneProgress[nextZoneId] = { completed: false, bossDefeated: false };
            }

            // Débloquer la première étape de la nouvelle zone
            const firstStageKey = `${nextZoneId}_1`;
            if (!this.stageProgress[firstStageKey]) {
                this.stageProgress[firstStageKey] = { unlocked: true, completed: false };
            } else {
                this.stageProgress[firstStageKey].unlocked = true;
            }
        } else {
            console.log(`[StorySystem] Félicitations ! Toutes les zones sont terminées !`);
        }
    }

    /**
     * Débloque l'étape suivante dans la même zone
     */
    unlockNextStage(zoneId, currentStageId) {
        const nextStageId = currentStageId + 1;
        const nextStageKey = `${zoneId}_${nextStageId}`;

        // Vérifier que l'étape suivante existe (max 11 étapes : 10 normales + 1 boss)
        if (nextStageId <= 11) {
            console.log(`[StorySystem] Étape ${nextStageId} de la zone ${zoneId} débloquée`);

            if (!this.stageProgress[nextStageKey]) {
                this.stageProgress[nextStageKey] = { unlocked: true, completed: false };
            } else {
                this.stageProgress[nextStageKey].unlocked = true;
            }
        }
    }

    /**
     * Distribue les récompenses à la fin d'une étape
     */
    distributeRewards(rewards) {
        if (!rewards) return;

        // Or
        if (rewards.gold) {
            this.game.economySystem.earnGold(rewards.gold);
            // Show UI notification ideally
            const rewardText = [];
            rewardText.push(`+${rewards.gold} Or`);

            // Note: UI notification logic would go here
        }

        // Expérience
        if (rewards.exp) {
            const party = this.game.partyManager.getParty();
            party.forEach(unit => {
                if (!unit.isDead()) {
                    unit.gainXp(rewards.exp);
                }
            });
            console.log(`[StorySystem] +${rewards.exp} XP distribués`);
        }
    }

    /**
     * Récupère la progression globale
     */
    getCurrentProgress() {
        const totalZones = 7;
        const completedZones = Object.values(this.zoneProgress).filter(p => p.completed).length;

        return {
            currentZone: this.currentZoneId,
            completedZones,
            totalZones,
            progressPercentage: Math.floor((completedZones / totalZones) * 100)
        };
    }

    /**
     * Sérialise l'état pour la sauvegarde
     */
    toJSON() {
        return {
            currentZoneId: this.currentZoneId,
            currentStageId: this.currentStageId,
            currentWave: this.currentWave,
            zoneProgress: this.zoneProgress,
            stageProgress: this.stageProgress
        };
    }

    /**
     * Restaure l'état depuis une sauvegarde
     */
    fromJSON(data) {
        if (!data) {
            this.initializeProgress();
            return;
        }

        this.currentZoneId = data.currentZoneId || null;
        this.currentStageId = data.currentStageId || null;
        this.currentWave = data.currentWave || 0;
        this.zoneProgress = data.zoneProgress || {};
        this.stageProgress = data.stageProgress || {};

        // S'assurer que la zone 1 est toujours initialisée
        if (!this.zoneProgress[1]) {
            this.zoneProgress[1] = { completed: false, bossDefeated: false };
        }
        if (!this.stageProgress['1_1']) {
            this.stageProgress['1_1'] = { unlocked: true, completed: false };
        }

        console.log('[StorySystem] Progression restaurée depuis la sauvegarde');
    }
}
