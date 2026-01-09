// Base de données générée automatiquement
export const UNIT_DATABASE = {
    "fire_tank_1": {
        "id": "fire_tank_1",
        "name": "Blaze Shield",
        "element": "fire",
        "class": "Tank",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 144,
            "atk": 15,
            "def": 19,
            "speed": 91,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the fire element."
    },
    "fire_tank_2": {
        "id": "fire_tank_2",
        "name": "Ignis Keeper",
        "element": "fire",
        "class": "Tank",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 143,
            "atk": 15,
            "def": 19,
            "speed": 88,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the fire element."
    },
    "fire_tank_3": {
        "id": "fire_tank_3",
        "name": "Pyre Defender",
        "element": "fire",
        "class": "Tank",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 145,
            "atk": 14,
            "def": 19,
            "speed": 94,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the fire element."
    },
    "fire_warrior_1": {
        "id": "fire_warrior_1",
        "name": "Pyre Fighter",
        "element": "fire",
        "class": "Warrior",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 115,
            "atk": 19,
            "def": 14,
            "speed": 95,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Battle Cry",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.7999999999999998,
                "description": "Strong Attack",
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the fire element."
    },
    "fire_warrior_2": {
        "id": "fire_warrior_2",
        "name": "Ember Brawler",
        "element": "fire",
        "class": "Warrior",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 118,
            "atk": 20,
            "def": 15,
            "speed": 95,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Strike",
                "type": "damage",
                "power": 1.2,
                "description": "Strong Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.7999999999999998,
                "description": "Strong Attack",
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the fire element."
    },
    "fire_support_1": {
        "id": "fire_support_1",
        "name": "Ash Mender",
        "element": "fire",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 98,
            "atk": 11,
            "def": 11,
            "speed": 102,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the fire element."
    },
    "fire_support_2": {
        "id": "fire_support_2",
        "name": "Flame Cleric",
        "element": "fire",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 104,
            "atk": 12,
            "def": 11,
            "speed": 104,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the fire element."
    },
    "fire_support_3": {
        "id": "fire_support_3",
        "name": "Inferno Oracle",
        "element": "fire",
        "class": "Support",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 100,
            "atk": 12,
            "def": 11,
            "speed": 101,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the fire element."
    },
    "fire_support_4": {
        "id": "fire_support_4",
        "name": "Cinder Guide",
        "element": "fire",
        "class": "Support",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 103,
            "atk": 11,
            "def": 12,
            "speed": 101,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the fire element."
    },
    "fire_ranger_1": {
        "id": "fire_ranger_1",
        "name": "Inferno Scout",
        "element": "fire",
        "class": "Ranger",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 93,
            "atk": 22,
            "def": 7,
            "speed": 113,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "description": "High Damage Single Target",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the fire element."
    },
    "fire_ranger_2": {
        "id": "fire_ranger_2",
        "name": "Cinder Hunter",
        "element": "fire",
        "class": "Ranger",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 87,
            "atk": 22,
            "def": 8,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "description": "High Damage Single Target",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the fire element."
    },
    "fire_assassin_1": {
        "id": "fire_assassin_1",
        "name": "Magma Rogue",
        "element": "fire",
        "class": "Assassin",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 78,
            "atk": 26,
            "def": 6,
            "speed": 125,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Massive Damage",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the fire element."
    },
    "fire_assassin_2": {
        "id": "fire_assassin_2",
        "name": "Scorch Blade",
        "element": "fire",
        "class": "Assassin",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 76,
            "atk": 25,
            "def": 6,
            "speed": 120,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Damage over time",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the fire element."
    },
    "fire_mage_1": {
        "id": "fire_mage_1",
        "name": "Flare Wizard",
        "element": "fire",
        "class": "Mage",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 82,
            "atk": 24,
            "def": 8,
            "speed": 90,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Meteor",
                "type": "damage",
                "power": 1.5,
                "target": "all_enemies",
                "description": "Massive Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "target": "all_enemies",
                "description": "Massive Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the fire element."
    },
    "fire_mage_2": {
        "id": "fire_mage_2",
        "name": "Heat Caster",
        "element": "fire",
        "class": "Mage",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 86,
            "atk": 23,
            "def": 7,
            "speed": 92,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Fireball",
                "type": "damage",
                "power": 1.3,
                "description": "Magic Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "description": "Magic Attack",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the fire element."
    },
    "water_tank_1": {
        "id": "water_tank_1",
        "name": "Aqua Protector",
        "element": "water",
        "class": "Tank",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 149,
            "atk": 15,
            "def": 19,
            "speed": 90,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the water element."
    },
    "water_tank_2": {
        "id": "water_tank_2",
        "name": "Tide Shield",
        "element": "water",
        "class": "Tank",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 147,
            "atk": 14,
            "def": 20,
            "speed": 88,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the water element."
    },
    "water_tank_3": {
        "id": "water_tank_3",
        "name": "Wave Sentinel",
        "element": "water",
        "class": "Tank",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 156,
            "atk": 15,
            "def": 19,
            "speed": 93,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the water element."
    },
    "water_warrior_1": {
        "id": "water_warrior_1",
        "name": "Wave Striker",
        "element": "water",
        "class": "Warrior",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 121,
            "atk": 20,
            "def": 15,
            "speed": 96,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Battle Cry",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up",
                "power": 1.7999999999999998,
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the water element."
    },
    "water_warrior_2": {
        "id": "water_warrior_2",
        "name": "Mist Fighter",
        "element": "water",
        "class": "Warrior",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 125,
            "atk": 19,
            "def": 15,
            "speed": 98,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Strike",
                "type": "damage",
                "power": 1.2,
                "description": "Strong Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.7999999999999998,
                "description": "Strong Attack",
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the water element."
    },
    "water_support_1": {
        "id": "water_support_1",
        "name": "Rain Oracle",
        "element": "water",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 101,
            "atk": 12,
            "def": 12,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the water element."
    },
    "water_support_2": {
        "id": "water_support_2",
        "name": "Ocean Mender",
        "element": "water",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 102,
            "atk": 11,
            "def": 11,
            "speed": 101,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the water element."
    },
    "water_support_3": {
        "id": "water_support_3",
        "name": "Frost Guide",
        "element": "water",
        "class": "Support",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 95,
            "atk": 12,
            "def": 11,
            "speed": 104,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the water element."
    },
    "water_support_4": {
        "id": "water_support_4",
        "name": "Ice Oracle",
        "element": "water",
        "class": "Support",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 98,
            "atk": 11,
            "def": 11,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the water element."
    },
    "water_ranger_1": {
        "id": "water_ranger_1",
        "name": "Frost Scout",
        "element": "water",
        "class": "Ranger",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 90,
            "atk": 22,
            "def": 8,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "description": "High Damage Single Target",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the water element."
    },
    "water_ranger_2": {
        "id": "water_ranger_2",
        "name": "Ice Shot",
        "element": "water",
        "class": "Ranger",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 86,
            "atk": 20,
            "def": 8,
            "speed": 110,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "target": "all_enemies",
                "description": "Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the water element."
    },
    "water_assassin_1": {
        "id": "water_assassin_1",
        "name": "Stream Killer",
        "element": "water",
        "class": "Assassin",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 78,
            "atk": 25,
            "def": 5,
            "speed": 124,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Poison",
                "type": "damage",
                "power": 1,
                "description": "Damage over time"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Massive Damage",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the water element."
    },
    "water_assassin_2": {
        "id": "water_assassin_2",
        "name": "River Blade",
        "element": "water",
        "class": "Assassin",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 76,
            "atk": 25,
            "def": 5,
            "speed": 115,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Massive Damage",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the water element."
    },
    "water_mage_1": {
        "id": "water_mage_1",
        "name": "Lake Wizard",
        "element": "water",
        "class": "Mage",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 83,
            "atk": 25,
            "def": 7,
            "speed": 93,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Meteor",
                "type": "damage",
                "power": 1.5,
                "target": "all_enemies",
                "description": "Massive Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "description": "Magic Attack",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the water element."
    },
    "water_mage_2": {
        "id": "water_mage_2",
        "name": "Drop Mage",
        "element": "water",
        "class": "Mage",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 85,
            "atk": 22,
            "def": 8,
            "speed": 93,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Fireball",
                "type": "damage",
                "power": 1.3,
                "description": "Magic Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "target": "all_enemies",
                "description": "Massive Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the water element."
    },
    "earth_tank_1": {
        "id": "earth_tank_1",
        "name": "Terra Keeper",
        "element": "earth",
        "class": "Tank",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 149,
            "atk": 15,
            "def": 19,
            "speed": 86,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the earth element."
    },
    "earth_tank_2": {
        "id": "earth_tank_2",
        "name": "Rock Defender",
        "element": "earth",
        "class": "Tank",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 150,
            "atk": 14,
            "def": 20,
            "speed": 90,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the earth element."
    },
    "earth_tank_3": {
        "id": "earth_tank_3",
        "name": "Stone Defender",
        "element": "earth",
        "class": "Tank",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 144,
            "atk": 15,
            "def": 19,
            "speed": 88,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the earth element."
    },
    "earth_warrior_1": {
        "id": "earth_warrior_1",
        "name": "Stone Blade",
        "element": "earth",
        "class": "Warrior",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 123,
            "atk": 19,
            "def": 15,
            "speed": 96,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Strike",
                "type": "damage",
                "power": 1.2,
                "description": "Strong Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.7999999999999998,
                "description": "Strong Attack",
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the earth element."
    },
    "earth_warrior_2": {
        "id": "earth_warrior_2",
        "name": "Root Fist",
        "element": "earth",
        "class": "Warrior",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 121,
            "atk": 19,
            "def": 15,
            "speed": 95,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Strike",
                "type": "damage",
                "power": 1.2,
                "description": "Strong Attack"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up",
                "power": 1.7999999999999998,
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the earth element."
    },
    "earth_support_1": {
        "id": "earth_support_1",
        "name": "Leaf Cleric",
        "element": "earth",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 99,
            "atk": 12,
            "def": 12,
            "speed": 100,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the earth element."
    },
    "earth_support_2": {
        "id": "earth_support_2",
        "name": "Gaia Priest",
        "element": "earth",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 104,
            "atk": 11,
            "def": 11,
            "speed": 109,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the earth element."
    },
    "earth_support_3": {
        "id": "earth_support_3",
        "name": "Dust Aide",
        "element": "earth",
        "class": "Support",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 100,
            "atk": 11,
            "def": 12,
            "speed": 109,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the earth element."
    },
    "earth_support_4": {
        "id": "earth_support_4",
        "name": "Sand Priest",
        "element": "earth",
        "class": "Support",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 98,
            "atk": 11,
            "def": 11,
            "speed": 100,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the earth element."
    },
    "earth_ranger_1": {
        "id": "earth_ranger_1",
        "name": "Dust Hunter",
        "element": "earth",
        "class": "Ranger",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 94,
            "atk": 20,
            "def": 7,
            "speed": 111,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Snipe",
                "type": "damage",
                "power": 1.5,
                "description": "High Damage Single Target"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "description": "High Damage Single Target",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the earth element."
    },
    "earth_ranger_2": {
        "id": "earth_ranger_2",
        "name": "Sand Shot",
        "element": "earth",
        "class": "Ranger",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 85,
            "atk": 22,
            "def": 8,
            "speed": 109,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Snipe",
                "type": "damage",
                "power": 1.5,
                "description": "High Damage Single Target"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "description": "High Damage Single Target",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the earth element."
    },
    "earth_assassin_1": {
        "id": "earth_assassin_1",
        "name": "Mud Dagger",
        "element": "earth",
        "class": "Assassin",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 76,
            "atk": 25,
            "def": 5,
            "speed": 114,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Poison",
                "type": "damage",
                "power": 1,
                "description": "Damage over time"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Massive Damage",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the earth element."
    },
    "earth_assassin_2": {
        "id": "earth_assassin_2",
        "name": "Clay Slayer",
        "element": "earth",
        "class": "Assassin",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 79,
            "atk": 26,
            "def": 5,
            "speed": 120,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Damage over time",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the earth element."
    },
    "earth_mage_1": {
        "id": "earth_mage_1",
        "name": "Moss Staff",
        "element": "earth",
        "class": "Mage",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 87,
            "atk": 23,
            "def": 7,
            "speed": 92,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Fireball",
                "type": "damage",
                "power": 1.3,
                "description": "Magic Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "target": "all_enemies",
                "description": "Massive Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the earth element."
    },
    "earth_mage_2": {
        "id": "earth_mage_2",
        "name": "Bark Caster",
        "element": "earth",
        "class": "Mage",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 83,
            "atk": 24,
            "def": 7,
            "speed": 95,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Fireball",
                "type": "damage",
                "power": 1.3,
                "description": "Magic Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "description": "Magic Attack",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the earth element."
    },
    "thunder_tank_1": {
        "id": "thunder_tank_1",
        "name": "Storm Keeper",
        "element": "thunder",
        "class": "Tank",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 144,
            "atk": 14,
            "def": 19,
            "speed": 88,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the thunder element."
    },
    "thunder_tank_2": {
        "id": "thunder_tank_2",
        "name": "Volt Shield",
        "element": "thunder",
        "class": "Tank",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 152,
            "atk": 15,
            "def": 19,
            "speed": 92,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the thunder element."
    },
    "thunder_tank_3": {
        "id": "thunder_tank_3",
        "name": "Spark Defender",
        "element": "thunder",
        "class": "Tank",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 143,
            "atk": 14,
            "def": 19,
            "speed": 85,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the thunder element."
    },
    "thunder_warrior_1": {
        "id": "thunder_warrior_1",
        "name": "Spark Striker",
        "element": "thunder",
        "class": "Warrior",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 124,
            "atk": 19,
            "def": 15,
            "speed": 95,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Strike",
                "type": "damage",
                "power": 1.2,
                "description": "Strong Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.7999999999999998,
                "description": "Strong Attack",
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the thunder element."
    },
    "thunder_warrior_2": {
        "id": "thunder_warrior_2",
        "name": "Zap Sword",
        "element": "thunder",
        "class": "Warrior",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 119,
            "atk": 19,
            "def": 14,
            "speed": 99,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Battle Cry",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up",
                "power": 1.7999999999999998,
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the thunder element."
    },
    "thunder_support_1": {
        "id": "thunder_support_1",
        "name": "Bolt Healer",
        "element": "thunder",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 96,
            "atk": 11,
            "def": 11,
            "speed": 109,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the thunder element."
    },
    "thunder_support_2": {
        "id": "thunder_support_2",
        "name": "Shock Oracle",
        "element": "thunder",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 98,
            "atk": 11,
            "def": 11,
            "speed": 100,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the thunder element."
    },
    "thunder_support_3": {
        "id": "thunder_support_3",
        "name": "Flash Aide",
        "element": "thunder",
        "class": "Support",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 96,
            "atk": 11,
            "def": 12,
            "speed": 102,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the thunder element."
    },
    "thunder_support_4": {
        "id": "thunder_support_4",
        "name": "Thunder Aide",
        "element": "thunder",
        "class": "Support",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 99,
            "atk": 12,
            "def": 12,
            "speed": 106,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the thunder element."
    },
    "thunder_ranger_1": {
        "id": "thunder_ranger_1",
        "name": "Flash Arrow",
        "element": "thunder",
        "class": "Ranger",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 90,
            "atk": 22,
            "def": 8,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "description": "High Damage Single Target",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the thunder element."
    },
    "thunder_ranger_2": {
        "id": "thunder_ranger_2",
        "name": "Thunder Bow",
        "element": "thunder",
        "class": "Ranger",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 85,
            "atk": 21,
            "def": 7,
            "speed": 105,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "target": "all_enemies",
                "description": "Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the thunder element."
    },
    "thunder_assassin_1": {
        "id": "thunder_assassin_1",
        "name": "Lightning Rogue",
        "element": "thunder",
        "class": "Assassin",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 80,
            "atk": 25,
            "def": 5,
            "speed": 121,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Massive Damage",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the thunder element."
    },
    "thunder_assassin_2": {
        "id": "thunder_assassin_2",
        "name": "Surge Shadow",
        "element": "thunder",
        "class": "Assassin",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 81,
            "atk": 25,
            "def": 6,
            "speed": 114,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Damage over time",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the thunder element."
    },
    "thunder_mage_1": {
        "id": "thunder_mage_1",
        "name": "Current Wand",
        "element": "thunder",
        "class": "Mage",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 89,
            "atk": 24,
            "def": 7,
            "speed": 92,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Meteor",
                "type": "damage",
                "power": 1.5,
                "target": "all_enemies",
                "description": "Massive Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "description": "Magic Attack",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the thunder element."
    },
    "thunder_mage_2": {
        "id": "thunder_mage_2",
        "name": "Amp Sorcerer",
        "element": "thunder",
        "class": "Mage",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 87,
            "atk": 23,
            "def": 7,
            "speed": 91,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Fireball",
                "type": "damage",
                "power": 1.3,
                "description": "Magic Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "target": "all_enemies",
                "description": "Massive Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the thunder element."
    },
    "light_tank_1": {
        "id": "light_tank_1",
        "name": "Lux Sentinel",
        "element": "light",
        "class": "Tank",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 153,
            "atk": 14,
            "def": 20,
            "speed": 90,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the light element."
    },
    "light_tank_2": {
        "id": "light_tank_2",
        "name": "Ray Guard",
        "element": "light",
        "class": "Tank",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 156,
            "atk": 14,
            "def": 19,
            "speed": 94,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the light element."
    },
    "light_tank_3": {
        "id": "light_tank_3",
        "name": "Shine Shield",
        "element": "light",
        "class": "Tank",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 144,
            "atk": 15,
            "def": 19,
            "speed": 93,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the light element."
    },
    "light_warrior_1": {
        "id": "light_warrior_1",
        "name": "Shine Sword",
        "element": "light",
        "class": "Warrior",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 114,
            "atk": 20,
            "def": 15,
            "speed": 102,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Strike",
                "type": "damage",
                "power": 1.2,
                "description": "Strong Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.7999999999999998,
                "description": "Strong Attack",
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the light element."
    },
    "light_warrior_2": {
        "id": "light_warrior_2",
        "name": "Glow Fist",
        "element": "light",
        "class": "Warrior",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 121,
            "atk": 19,
            "def": 15,
            "speed": 103,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Battle Cry",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up",
                "power": 1.7999999999999998,
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the light element."
    },
    "light_support_1": {
        "id": "light_support_1",
        "name": "Sun Priest",
        "element": "light",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 100,
            "atk": 11,
            "def": 12,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the light element."
    },
    "light_support_2": {
        "id": "light_support_2",
        "name": "Star Priest",
        "element": "light",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 100,
            "atk": 12,
            "def": 11,
            "speed": 108,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the light element."
    },
    "light_support_3": {
        "id": "light_support_3",
        "name": "Bright Priest",
        "element": "light",
        "class": "Support",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 98,
            "atk": 12,
            "def": 12,
            "speed": 104,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the light element."
    },
    "light_support_4": {
        "id": "light_support_4",
        "name": "Dawn Mender",
        "element": "light",
        "class": "Support",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 99,
            "atk": 11,
            "def": 11,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the light element."
    },
    "light_ranger_1": {
        "id": "light_ranger_1",
        "name": "Bright Hunter",
        "element": "light",
        "class": "Ranger",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 85,
            "atk": 21,
            "def": 8,
            "speed": 115,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "target": "all_enemies",
                "description": "Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the light element."
    },
    "light_ranger_2": {
        "id": "light_ranger_2",
        "name": "Dawn Scout",
        "element": "light",
        "class": "Ranger",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 88,
            "atk": 23,
            "def": 8,
            "speed": 108,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Snipe",
                "type": "damage",
                "power": 1.5,
                "description": "High Damage Single Target"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "description": "High Damage Single Target",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the light element."
    },
    "light_assassin_1": {
        "id": "light_assassin_1",
        "name": "Day Rogue",
        "element": "light",
        "class": "Assassin",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 78,
            "atk": 26,
            "def": 6,
            "speed": 125,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Poison",
                "type": "damage",
                "power": 1,
                "description": "Damage over time"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Damage over time",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the light element."
    },
    "light_assassin_2": {
        "id": "light_assassin_2",
        "name": "Beam Killer",
        "element": "light",
        "class": "Assassin",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 76,
            "atk": 24,
            "def": 5,
            "speed": 118,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Massive Damage",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the light element."
    },
    "light_mage_1": {
        "id": "light_mage_1",
        "name": "Halo Wizard",
        "element": "light",
        "class": "Mage",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 89,
            "atk": 24,
            "def": 7,
            "speed": 97,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Meteor",
                "type": "damage",
                "power": 1.5,
                "target": "all_enemies",
                "description": "Massive Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "target": "all_enemies",
                "description": "Massive Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the light element."
    },
    "light_mage_2": {
        "id": "light_mage_2",
        "name": "Glory Witch",
        "element": "light",
        "class": "Mage",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 82,
            "atk": 24,
            "def": 8,
            "speed": 96,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Meteor",
                "type": "damage",
                "power": 1.5,
                "target": "all_enemies",
                "description": "Massive Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "description": "Magic Attack",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the light element."
    },
    "dark_tank_1": {
        "id": "dark_tank_1",
        "name": "Umbra Guard",
        "element": "dark",
        "class": "Tank",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 157,
            "atk": 15,
            "def": 19,
            "speed": 88,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the dark element."
    },
    "dark_tank_2": {
        "id": "dark_tank_2",
        "name": "Shadow Protector",
        "element": "dark",
        "class": "Tank",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 146,
            "atk": 15,
            "def": 20,
            "speed": 92,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Taunt",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the dark element."
    },
    "dark_tank_3": {
        "id": "dark_tank_3",
        "name": "Night Protector",
        "element": "dark",
        "class": "Tank",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 147,
            "atk": 14,
            "def": 19,
            "speed": 92,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Shield Wall",
                "type": "buff",
                "stat": "def",
                "value": 0.5,
                "duration": 2,
                "target": "all",
                "description": "Team Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.3,
                "duration": 3,
                "target": "self",
                "description": "Taunt enemies",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Tank of the dark element."
    },
    "dark_warrior_1": {
        "id": "dark_warrior_1",
        "name": "Night Striker",
        "element": "dark",
        "class": "Warrior",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 123,
            "atk": 20,
            "def": 15,
            "speed": 98,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Battle Cry",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "atk",
                "value": 0.3,
                "duration": 3,
                "target": "all",
                "description": "Team Attack Up",
                "power": 1.7999999999999998,
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the dark element."
    },
    "dark_warrior_2": {
        "id": "dark_warrior_2",
        "name": "Dusk Brawler",
        "element": "dark",
        "class": "Warrior",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 117,
            "atk": 20,
            "def": 15,
            "speed": 95,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Strike",
                "type": "damage",
                "power": 1.2,
                "description": "Strong Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.7999999999999998,
                "description": "Strong Attack",
                "cooldown": 5
            }
        ],
        "description": "A Warrior of the dark element."
    },
    "dark_support_1": {
        "id": "dark_support_1",
        "name": "Void Guide",
        "element": "dark",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 96,
            "atk": 11,
            "def": 11,
            "speed": 110,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the dark element."
    },
    "dark_support_2": {
        "id": "dark_support_2",
        "name": "Abyss Guide",
        "element": "dark",
        "class": "Support",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 95,
            "atk": 11,
            "def": 12,
            "speed": 106,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Blessing",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the dark element."
    },
    "dark_support_3": {
        "id": "dark_support_3",
        "name": "Gloom Healer",
        "element": "dark",
        "class": "Support",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 98,
            "atk": 11,
            "def": 11,
            "speed": 107,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the dark element."
    },
    "dark_support_4": {
        "id": "dark_support_4",
        "name": "Shade Aide",
        "element": "dark",
        "class": "Support",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 100,
            "atk": 11,
            "def": 12,
            "speed": 108,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Heal",
                "type": "heal",
                "value": 40,
                "target": "single",
                "description": "Heal Ally"
            },
            {
                "name": "Ultimate",
                "type": "buff",
                "stat": "def",
                "value": 0.2,
                "duration": 3,
                "target": "all",
                "description": "Minor Defense Up",
                "power": 1.5,
                "cooldown": 5
            }
        ],
        "description": "A Support of the dark element."
    },
    "dark_ranger_1": {
        "id": "dark_ranger_1",
        "name": "Gloom Arrow",
        "element": "dark",
        "class": "Ranger",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 85,
            "atk": 22,
            "def": 8,
            "speed": 111,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Volley",
                "type": "damage",
                "power": 0.8,
                "target": "all_enemies",
                "description": "Area Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "target": "all_enemies",
                "description": "Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the dark element."
    },
    "dark_ranger_2": {
        "id": "dark_ranger_2",
        "name": "Shade Arrow",
        "element": "dark",
        "class": "Ranger",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 94,
            "atk": 21,
            "def": 7,
            "speed": 112,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Snipe",
                "type": "damage",
                "power": 1.5,
                "description": "High Damage Single Target"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 2.25,
                "target": "all_enemies",
                "description": "Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Ranger of the dark element."
    },
    "dark_assassin_1": {
        "id": "dark_assassin_1",
        "name": "Obsidian Killer",
        "element": "dark",
        "class": "Assassin",
        "baseRarity": 4,
        "maxRarity": 7,
        "baseStats": {
            "hp": 80,
            "atk": 24,
            "def": 6,
            "speed": 120,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Damage over time",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the dark element."
    },
    "dark_assassin_2": {
        "id": "dark_assassin_2",
        "name": "Raven Dagger",
        "element": "dark",
        "class": "Assassin",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 82,
            "atk": 25,
            "def": 5,
            "speed": 121,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Backstab",
                "type": "damage",
                "power": 2,
                "description": "Massive Damage"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 3,
                "description": "Damage over time",
                "cooldown": 5
            }
        ],
        "description": "A Assassin of the dark element."
    },
    "dark_mage_1": {
        "id": "dark_mage_1",
        "name": "Crow Caster",
        "element": "dark",
        "class": "Mage",
        "baseRarity": 3,
        "maxRarity": 6,
        "baseStats": {
            "hp": 84,
            "atk": 25,
            "def": 8,
            "speed": 95,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Fireball",
                "type": "damage",
                "power": 1.3,
                "description": "Magic Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "target": "all_enemies",
                "description": "Massive Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the dark element."
    },
    "dark_mage_2": {
        "id": "dark_mage_2",
        "name": "Bat Wand",
        "element": "dark",
        "class": "Mage",
        "baseRarity": 5,
        "maxRarity": 7,
        "baseStats": {
            "hp": 87,
            "atk": 22,
            "def": 7,
            "speed": 91,
            "maxBbGauge": 100
        },
        "skills": [
            {
                "name": "Attack",
                "type": "damage",
                "power": 1,
                "cooldown": 0,
                "description": "Basic Attack"
            },
            {
                "name": "Fireball",
                "type": "damage",
                "power": 1.3,
                "description": "Magic Attack"
            },
            {
                "name": "Ultimate",
                "type": "damage",
                "power": 1.9500000000000002,
                "target": "all_enemies",
                "description": "Massive Area Damage",
                "cooldown": 5
            }
        ],
        "description": "A Mage of the dark element."
    }
};

export const RARITY_MULTIPLIERS = {
    1: 0.5,
    2: 0.7,
    3: 1.0,
    4: 1.3,
    5: 1.6,
    6: 2.0,
    7: 2.5
};

export const EVOLUTION_COSTS = {
    1: 1000,
    2: 2500,
    3: 5000,
    4: 10000,
    5: 20000,
    6: 35000,
    7: 50000
};

export function getUnitData(unitId) {
    return UNIT_DATABASE[unitId] || null;
}

export function getStatsForRarity(unitId, rarity) {
    const unitData = getUnitData(unitId);
    if (!unitData) return null;

    const multiplier = RARITY_MULTIPLIERS[rarity] || 1.0;
    const baseStats = unitData.baseStats;

    return {
        name: unitData.name,
        element: unitData.element,
        description: unitData.description,
        unitId: unitId,
        baseRarity: unitData.baseRarity,
        currentRarity: rarity,
        maxRarity: unitData.maxRarity,
        hp: Math.floor(baseStats.hp * multiplier),
        atk: Math.floor(baseStats.atk * multiplier),
        def: Math.floor(baseStats.def * multiplier),
        speed: Math.floor((baseStats.speed || 100) * multiplier),
        maxBbGauge: baseStats.maxBbGauge,
        skills: unitData.skills,
        class: unitData.class || 'Warrior',
        level: 1,
        xp: 0
    };
}

export function getAllUnitIds() {
    return Object.keys(UNIT_DATABASE);
}

export function getRandomUnit() {
    const roll = Math.random() * 100;
    let targetRarity;
    if (roll < 5) targetRarity = 5;
    else if (roll < 20) targetRarity = 4;
    else targetRarity = 3;

    const availableUnits = Object.values(UNIT_DATABASE).filter(
        unit => unit.baseRarity === targetRarity
    );

    if (availableUnits.length === 0) {
        const allIds = getAllUnitIds();
        const randomId = allIds[Math.floor(Math.random() * allIds.length)];
        const unitData = getUnitData(randomId);
        return getStatsForRarity(randomId, unitData.baseRarity);
    }

    const randomUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
    return getStatsForRarity(randomUnit.id, randomUnit.baseRarity);
}
