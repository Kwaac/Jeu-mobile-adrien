export default class Item {
    constructor(id, name, description, type, rarity = 1) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type; // 'consumable', 'material', 'equipment'
        this.rarity = rarity;
    }
}
