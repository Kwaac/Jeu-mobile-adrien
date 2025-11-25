export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.touchStartX = 0;
        this.touchStartY = 0;

        window.addEventListener('mousedown', e => this.handleStart(e.clientX, e.clientY));
        window.addEventListener('touchstart', e => this.handleStart(e.changedTouches[0].clientX, e.changedTouches[0].clientY));

        window.addEventListener('mouseup', e => this.handleEnd(e.clientX, e.clientY));
        window.addEventListener('touchend', e => this.handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY));
    }

    handleStart(x, y) {
        this.touchStartX = x;
        this.touchStartY = y;
    }

    handleEnd(x, y) {
        const dx = x - this.touchStartX;
        const dy = y - this.touchStartY;

        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
            this.game.battleSystem.onTap(x, y);
        } else {
            // Swipe detection logic can go here
            if (Math.abs(dy) > Math.abs(dx)) {
                if (dy < -50) this.game.battleSystem.onSwipeUp(this.touchStartX, this.touchStartY);
            }
        }
    }
}
