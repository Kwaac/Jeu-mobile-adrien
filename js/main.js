console.log('[MAIN.JS] Module loaded - starting import (v16)');
import Game from './core/Game.js?v=16';

window.addEventListener('load', () => {
    if (window.game) {
        console.log('Game already initialized, skipping...');
        return;
    }
    console.log('Initializing Game...');
    const canvas = document.getElementById('game-canvas');
    const game = new Game(canvas);

    // HOTFIX: Ensure QuestSystem is present if missing
    if (!game.questSystem) {
        import('./systems/QuestSystem.js').then(m => {
            game.questSystem = new m.default(game);
            console.log('QuestSystem hot-loaded in main.js');
        });
    }

    window.game = game; // Expose for console testing
    game.start();
});
