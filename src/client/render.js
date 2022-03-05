import { getCurrentState } from './state'

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;

const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

function render() {
    const gameState = getCurrentState();

    if (!gameState) 
        return;

    // render background
    context.fillStyle = "white";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // render players
    gameState.players?.forEach(player => {
        context.strokeStyle = 'green';
        for (let i = 0; i < player.trail.length - 1; i++) {
            if (player.trail[i].x == -1 || player.trail[i+1].x == -1) continue;
            context.moveTo(player.trail[i].x, player.trail[i].y);
            context.lineTo(player.trail[i+1].x, player.trail[i+1].y);
            context.stroke();
        }
        let i = player.trail.length - 1;
        context.moveTo(player.trail[i].x, player.trail[i].y);
        context.lineTo(player.x, player.y);
        context.stroke();

        context.fillStyle = "black";
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2*Math.PI);
        context.fill();
    });
}

export function startRendering() {
    setInterval(render, 1000 / 60);
}


