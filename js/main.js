console.log('[MAIN.JS] Module loaded - starting import');
import Game from './core/Game.js';

window.addEventListener('load', () => {
    if (window.game) {
        console.log('Game already initialized, skipping...');
        return;
    }
    console.log('Initializing Game...');
    const canvas = document.getElementById('game-canvas');
    const game = new Game(canvas);
    window.game = game; // Expose for console testing
    game.start();
});
