console.log('[MAIN.JS] Module loaded - starting import (v2)');
import Game from './core/Game.js?v=6';

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
