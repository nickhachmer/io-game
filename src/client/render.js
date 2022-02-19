import { getCurrentState } from './state'

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

function render() {
    const gameState = getCurrentState();

    if (!gameState) 
        return;

    // render players
    gameState.players.forEach(player => {
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2*Math.PI);
        context.fill();
    });
}

export function startRendering() {
    setInterval(render, 1000 / 30);
}


