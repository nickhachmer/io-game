import { sendInput } from "./networking";

function processKey(event) {
    let inputData = {
        up: false,
        left: false,
        down: false,
        right: false,
    };

    switch(event.key) {
        case "ArrowUp":
        case "w":
            inputData.up = true;
            break;
        case "ArrowLeft":
        case "a":
            inputData.left = true;
            break;
        case "ArrowDown":
        case "s":
            inputData.down = true;
            break;
        case "ArrowRight":
        case "d":
            inputData.right = true;
            break;
    }

    sendInput(inputData);
}

export function startCapturingInput() {
    window.addEventListener('keydown', processKey);
}

export function stopCapturingInput() {
    window.removeEventListener('keydown', processKey);
}
