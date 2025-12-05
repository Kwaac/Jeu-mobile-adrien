/**
 * ElementalBonusSystem.js
 * Gère les bonus d'équipe basés sur la composition élémentaire
 */

export default class ElementalBonusSystem {
    constructor() {
        // Définition des bonus de base pour chaque élément (pour 1 unité)
        this.bonusDefinitions = {
            fire: {
                atk: 0.05,      // +5% ATK
                crit: 0.02      // +2% chance critique
            },
            water: {
                speed: 0.03,    // +3% vitesse
                hpRegen: 0.01   // +1% HP regen par tour
            },
            earth: {
                def: 0.06,      // +6% DEF
                hp: 0.04        // +4% HP
            },
            thunder: {
                atk: 0.04,          // +4% ATK
                bbFillRate: 0.08    // +8% BB fill rate
            },
            light: {
                balanced: 0.03,     // +3% ATK/DEF/HP
                debuffRes: 0.05     // +5% résistance debuff
            },
            dark: {
                bbDamage: 0.08,     // +8% BB damage
                lifesteal: 0.03     // +3% lifesteal
            }
        };

        // Multiplicateurs de scaling selon le nombre d'unités
        this.scalingMultipliers = {
            0: 0,
            1: 1.0,     // 100% du bonus de base
            2: 1.8,     // 180% du bonus de base
            3: 2.5,     // 250% du bonus de base
            4: 3.2,     // 320% du bonus de base
            5: 4.0      // 400% du bonus de base (équipe mono-élément)
        };

        // Bonus Rainbow (5 éléments différents)
        this.rainbowBonus = {
            atk: 0.05,
            def: 0.05,
            hp: 0.05,
            elementalRes: 0.05
        };
    }

    /**
     * Compte le nombre d'unités de chaque élément dans l'équipe
     * @param {Array} party - Tableau d'unités
     * @returns {Object} - Objet avec le compte de chaque élément
     */
    countElements(party) {
        const elementCounts = {
            fire: 0,
            water: 0,
            earth: 0,
            thunder: 0,
            light: 0,
            dark: 0
        };

        party.forEach(unit => {
            if (unit && unit.element && elementCounts.hasOwnProperty(unit.element)) {
                elementCounts[unit.element]++;
            }
        });

        return elementCounts;
    }

    /**
     * Vérifie si l'équipe a le bonus Rainbow
     * @param {Object} elementCounts - Compte des éléments
     * @returns {boolean}
     */
    hasRainbowBonus(elementCounts) {
        const uniqueElements = Object.values(elementCounts).filter(count => count > 0).length;
        return uniqueElements >= 5;
    }

    /**
     * Calcule tous les bonus actifs pour l'équipe
     * @param {Array} party - Tableau d'unités
     * @returns {Object} - Objet contenant tous les bonus calculés
     */
    calculateTeamBonuses(party) {
        if (!party || party.length === 0) {
            return this.getEmptyBonuses();
        }

        const elementCounts = this.countElements(party);
        const bonuses = {
            // Bonus de stats
            atk: 0,
            def: 0,
            hp: 0,

            // Bonus spéciaux
            crit: 0,
            speed: 0,
            hpRegen: 0,
            bbFillRate: 0,
            bbDamage: 0,
            lifesteal: 0,
            debuffRes: 0,
            elementalRes: 0,

            // Détails pour l'UI
            activeElements: [],
            isRainbow: false
        };

        // Calculer les bonus pour chaque élément présent
        for (const [element, count] of Object.entries(elementCounts)) {
            if (count > 0) {
                const multiplier = this.scalingMultipliers[count];
                const elementBonuses = this.bonusDefinitions[element];

                // Appliquer les bonus de cet élément
                for (const [bonusType, baseValue] of Object.entries(elementBonuses)) {
                    const scaledValue = baseValue * multiplier;

                    if (bonusType === 'balanced') {
                        // Light: bonus équilibré sur ATK/DEF/HP
                        bonuses.atk += scaledValue;
                        bonuses.def += scaledValue;
                        bonuses.hp += scaledValue;
                    } else {
                        bonuses[bonusType] = (bonuses[bonusType] || 0) + scaledValue;
                    }
                }

                // Ajouter aux éléments actifs pour l'UI
                bonuses.activeElements.push({
                    element: element,
                    count: count,
                    multiplier: multiplier
                });
            }
        }

        // Vérifier et appliquer le bonus Rainbow
        if (this.hasRainbowBonus(elementCounts)) {
            bonuses.isRainbow = true;
            bonuses.atk += this.rainbowBonus.atk;
            bonuses.def += this.rainbowBonus.def;
            bonuses.hp += this.rainbowBonus.hp;
            bonuses.elementalRes += this.rainbowBonus.elementalRes;
        }

        return bonuses;
    }

    /**
     * Retourne un objet de bonus vide
     * @returns {Object}
     */
    getEmptyBonuses() {
        return {
            atk: 0,
            def: 0,
            hp: 0,
            crit: 0,
            speed: 0,
            hpRegen: 0,
            bbFillRate: 0,
            bbDamage: 0,
            lifesteal: 0,
            debuffRes: 0,
            elementalRes: 0,
            activeElements: [],
            isRainbow: false
        };
    }

    /**
     * Formate les bonus pour l'affichage UI
     * @param {Object} bonuses - Objet de bonus calculés
     * @returns {Array} - Tableau de strings formatés
     */
    formatBonusesForUI(bonuses) {
        const formatted = [];

        // Icônes des éléments
        const elementIcons = {
            fire: '🔥',
            water: '💧',
            earth: '🌿',
            thunder: '⚡',
            light: '✨',
            dark: '🌑'
        };

        // Afficher les bonus par élément
        bonuses.activeElements.forEach(({ element, count, multiplier }) => {
            const icon = elementIcons[element] || '⭐';
            const elementName = element.charAt(0).toUpperCase() + element.slice(1);
            const def = this.bonusDefinitions[element];

            let bonusText = `${icon} ${elementName} (×${count}): `;
            const bonusParts = [];

            // Construire le texte des bonus
            for (const [type, baseValue] of Object.entries(def)) {
                const value = Math.round(baseValue * multiplier * 100);

                if (type === 'atk') bonusParts.push(`+${value}% ATK`);
                else if (type === 'def') bonusParts.push(`+${value}% DEF`);
                else if (type === 'hp') bonusParts.push(`+${value}% HP`);
                else if (type === 'crit') bonusParts.push(`+${value}% Crit`);
                else if (type === 'speed') bonusParts.push(`+${value}% Speed`);
                else if (type === 'hpRegen') bonusParts.push(`+${value}% HP/tour`);
                else if (type === 'bbFillRate') bonusParts.push(`+${value}% BB Fill`);
                else if (type === 'bbDamage') bonusParts.push(`+${value}% BB DMG`);
                else if (type === 'lifesteal') bonusParts.push(`+${value}% Lifesteal`);
                else if (type === 'debuffRes') bonusParts.push(`+${value}% Debuff Res`);
                else if (type === 'balanced') {
                    bonusParts.push(`+${value}% ATK/DEF/HP`);
                }
            }

            bonusText += bonusParts.join(', ');
            formatted.push(bonusText);
        });

        // Ajouter le bonus Rainbow si actif
        if (bonuses.isRainbow) {
            formatted.push('🌈 Rainbow: +5% toutes stats, +5% Res Elem');
        }

        return formatted;
    }

    /**
     * Obtient un résumé des bonus totaux
     * @param {Object} bonuses - Objet de bonus calculés
     * @returns {Object} - Résumé des bonus principaux
     */
    getTotalBonusSummary(bonuses) {
        return {
            totalAtk: Math.round(bonuses.atk * 100),
            totalDef: Math.round(bonuses.def * 100),
            totalHp: Math.round(bonuses.hp * 100),
            totalBbFill: Math.round(bonuses.bbFillRate * 100),
            totalBbDamage: Math.round(bonuses.bbDamage * 100),
            hasSpecialEffects: bonuses.hpRegen > 0 || bonuses.lifesteal > 0
        };
    }
}
