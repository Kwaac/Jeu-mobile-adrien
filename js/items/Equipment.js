import Item from './Item.js';

export default class Equipment extends Item {
    constructor(id, name, description, slot, stats) {
        super(id, name, description, 'equipment');
        this.slot = slot; // 'weapon', 'armor', 'accessory'
        this.stats = stats; // { atk: 10, def: 5, etc. }
        this.level = 0;
        this.maxLevel = 10;
    }
}
