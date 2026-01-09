import Unit from '../entities/Unit.js';
import { getStatsForRarity } from '../data/UnitDatabase.js';
import ElementalBonusSystem from './ElementalBonusSystem.js';

export default class PartyManager {
    constructor(game) {
        this.game = game;
        this.ownedUnits = []; // Toutes les unités possédées
        this.party = []; // Équipe de combat active (max 5)
        this.maxPartySize = 5;
        this.selectedUnit = null; // Unité actuellement sélectionnée dans l'UI

        // Système de bonus élémentaires
        this.elementalBonusSystem = new ElementalBonusSystem();
        this.currentTeamBonuses = null;

        this.initializeDefaultUnits();
    }


    initializeDefaultUnits() {
        // No default units. Player starts with 0.
        // The first summon tutorial will handle the starter unit.
        console.log('PartyManager initialized. Waiting for first summon.');
    }


    addUnit(unit) {
        if (!this.ownedUnits.includes(unit)) {
            this.ownedUnits.push(unit);
            console.log(`Unité ajoutée : ${unit.name}`);
        }
    }

    removeUnit(unit) {
        const index = this.ownedUnits.indexOf(unit);
        if (index > -1) {
            this.ownedUnits.splice(index, 1);
            this.removeFromParty(unit); // Retirer aussi de l'équipe si présent
            console.log(`Unité retirée : ${unit.name}`);
        }
    }

    addToParty(unit) {
        if (this.party.length >= this.maxPartySize) {
            console.log('Équipe complète ! Maximum 5 unités.');
            return 'PARTY_FULL';
        }

        if (!this.ownedUnits.includes(unit)) {
            console.log('Cette unité n\'est pas possédée !');
            return 'NOT_OWNED';
        }

        // Check for duplicate type (unitId)
        const isDuplicateType = this.party.some(p => p.unitId === unit.unitId);
        if (isDuplicateType) {
            console.log(`Un héros de type ${unit.name} est déjà dans l'équipe.`);
            return 'DUPLICATE_NAME';
        }

        if (this.party.includes(unit)) {
            console.log(`${unit.name} est déjà dans l'équipe.`);
            return 'ALREADY_IN_PARTY';
        }

        this.party.push(unit);
        console.log(`${unit.name} ajouté à l'équipe de combat.`);

        // Recalculer les bonus d'équipe
        // Recalculer les bonus d'équipe
        this.updateTeamBonuses();

        // Auto-position if no saved position
        if (unit.savedPosition === null) {
            // Find first available spot (0-5)
            const usedPositions = this.party.map(u => u.savedPosition).filter(p => p !== null);
            for (let i = 0; i < 6; i++) {
                if (!usedPositions.includes(i)) {
                    unit.savedPosition = i;
                    break;
                }
            }
        }

        return 'SUCCESS';
    }

    /**
     * Sauvegarde la position d'une unité dans la formation
     * @param {Unit} unit - L'unité à positionner
     * @param {number} position - Position 0-5
     */
    saveUnitPosition(unit, position) {
        if (!this.party.includes(unit)) return;

        // Vérifier si la position est valide
        if (position < 0 || position > 5) return;

        // Vérifier si la position est déjà prise par quelqu'un d'autre
        const occupant = this.party.find(u => u.savedPosition === position && u !== unit);

        if (occupant) {
            // Swap positions
            occupant.savedPosition = unit.savedPosition;
        }

        unit.savedPosition = position;
        console.log(`Position sauvegardée pour ${unit.name} : ${position}`);

        return true;
    }

    removeFromParty(unit) {
        const index = this.party.indexOf(unit);
        if (index > -1) {
            this.party.splice(index, 1);
            console.log(`${unit.name} retiré de l'équipe de combat.`);

            // Recalculer les bonus d'équipe
            this.updateTeamBonuses();

            return true;
        }
        return false;
    }

    isInParty(unit) {
        return this.party.includes(unit);
    }

    getParty() {
        return this.party;
    }

    getOwnedUnits() {
        return this.ownedUnits;
    }

    getUnitsNotInParty() {
        return this.ownedUnits.filter(unit => !this.isInParty(unit));
    }

    selectUnit(unit) {
        this.selectedUnit = unit;
        console.log(`Unité sélectionnée : ${unit.name}`);
    }

    getAllUnits() {
        return this.ownedUnits;
    }

    getSelectedUnit() {
        return this.selectedUnit;
    }

    /**
     * Met à jour les bonus d'équipe basés sur la composition élémentaire
     */
    updateTeamBonuses() {
        this.currentTeamBonuses = this.elementalBonusSystem.calculateTeamBonuses(this.party);
        console.log('🌟 Bonus d\'équipe mis à jour:', this.currentTeamBonuses);
    }

    /**
     * Récupère les bonus d'équipe actuels
     * @returns {Object} Bonus d'équipe
     */
    getTeamBonuses() {
        if (!this.currentTeamBonuses) {
            this.updateTeamBonuses();
        }
        return this.currentTeamBonuses;
    }

    /**
     * Récupère les bonus formatés pour l'affichage UI
     * @returns {Array} Tableau de strings formatés
     */
    getFormattedTeamBonuses() {
        const bonuses = this.getTeamBonuses();
        return this.elementalBonusSystem.formatBonusesForUI(bonuses);
    }

    /**
     * Récupère un résumé des bonus totaux
     * @returns {Object} Résumé des bonus
     */
    getTeamBonusSummary() {
        const bonuses = this.getTeamBonuses();
        return this.elementalBonusSystem.getTotalBonusSummary(bonuses);
    }

    /**
     * Sérialise l'état du PartyManager pour la sauvegarde
     * @returns {Object} État sérialisé
     */
    toJSON() {
        return {
            ownedUnits: this.ownedUnits.map(unit => this.serializeUnit(unit)),
            partyInstanceIds: this.party.map(unit => unit.instanceId),
            selectedUnitId: this.selectedUnit ? this.selectedUnit.instanceId : null,
            maxPartySize: this.maxPartySize
        };
    }

    /**
     * Sérialise une unité individuelle
     * @param {Unit} unit - Unité à sérialiser
     * @returns {Object} Données de l'unité
     */
    serializeUnit(unit) {
        return {
            instanceId: unit.instanceId,
            name: unit.name,
            unitId: unit.unitId,
            isPlayer: unit.isPlayer,

            // Stats
            hp: unit.hp,
            maxHp: unit.maxHp,
            atk: unit.atk,
            def: unit.def,
            baseAtk: unit.baseAtk,
            baseDef: unit.baseDef,
            baseMaxHp: unit.baseMaxHp,

            // Progression
            level: unit.level,
            xp: unit.xp,
            xpToNextLevel: unit.xpToNextLevel,

            // Rarity/Evolution
            baseRarity: unit.baseRarity,
            currentRarity: unit.currentRarity,
            maxRarity: unit.maxRarity,
            evolutionCount: unit.evolutionCount,

            // Properties
            element: unit.element,
            description: unit.description,

            // BB
            bbGauge: unit.bbGauge,
            maxBbGauge: unit.maxBbGauge,

            // Equipment
            equipment: {
                weapon: unit.equipment.weapon ? this.serializeEquipment(unit.equipment.weapon) : null,
                armor: unit.equipment.armor ? this.serializeEquipment(unit.equipment.armor) : null,
                accessory: unit.equipment.accessory ? this.serializeEquipment(unit.equipment.accessory) : null
            }
        };
    }

    /**
     * Sérialise un équipement
     * @param {Equipment} item - Équipement à sérialiser
     * @returns {Object} Données de l'équipement
     */
    serializeEquipment(item) {
        return {
            id: item.id,
            name: item.name,
            description: item.description,
            slot: item.slot,
            stats: { ...item.stats },
            type: item.type
        };
    }

    /**
     * Restaure l'état du PartyManager depuis une sauvegarde
     * @param {Object} data - Données sauvegardées
     */
    fromJSON(data) {
        if (!data) return;

        // Import dynamique de Unit et Equipment
        import('../entities/Unit.js').then(({ default: Unit }) => {
            import('../items/Equipment.js').then(({ default: Equipment }) => {

                // Restaurer les unités possédées
                if (data.ownedUnits) {
                    this.ownedUnits = data.ownedUnits.map(unitData => {
                        const unit = new Unit(unitData.name, unitData.isPlayer, unitData);

                        // Restaurer l'instanceId pour maintenir les références
                        unit.instanceId = unitData.instanceId;

                        // Patch missing speed for old saves
                        if (!unit.speed) unit.speed = 100;
                        if (!unit.baseSpeed) unit.baseSpeed = 100;

                        // Restaurer l'équipement
                        if (unitData.equipment) {
                            if (unitData.equipment.weapon) {
                                const weapon = new Equipment(
                                    unitData.equipment.weapon.id,
                                    unitData.equipment.weapon.name,
                                    unitData.equipment.weapon.description,
                                    unitData.equipment.weapon.slot,
                                    unitData.equipment.weapon.stats
                                );
                                weapon.type = unitData.equipment.weapon.type;
                                unit.equipment.weapon = weapon;
                            }

                            if (unitData.equipment.armor) {
                                const armor = new Equipment(
                                    unitData.equipment.armor.id,
                                    unitData.equipment.armor.name,
                                    unitData.equipment.armor.description,
                                    unitData.equipment.armor.slot,
                                    unitData.equipment.armor.stats
                                );
                                armor.type = unitData.equipment.armor.type;
                                unit.equipment.armor = armor;
                            }

                            if (unitData.equipment.accessory) {
                                const accessory = new Equipment(
                                    unitData.equipment.accessory.id,
                                    unitData.equipment.accessory.name,
                                    unitData.equipment.accessory.description,
                                    unitData.equipment.accessory.slot,
                                    unitData.equipment.accessory.stats
                                );
                                accessory.type = unitData.equipment.accessory.type;
                                unit.equipment.accessory = accessory;
                            }
                        }

                        return unit;
                    });
                }

                // Restaurer l'équipe active (par référence aux instanceIds)
                if (data.partyInstanceIds) {
                    this.party = [];
                    data.partyInstanceIds.forEach(instanceId => {
                        const unit = this.ownedUnits.find(u => u.instanceId === instanceId);
                        if (unit) {
                            this.party.push(unit);
                        }
                    });
                }

                // Restaurer l'unité sélectionnée
                if (data.selectedUnitId) {
                    this.selectedUnit = this.ownedUnits.find(u => u.instanceId === data.selectedUnitId) || null;
                }

                if (data.maxPartySize !== undefined) {
                    this.maxPartySize = data.maxPartySize;
                }

                console.log('[PartyManager] State restored from save');
            });
        });
    }
}
