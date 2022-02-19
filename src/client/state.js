

let currentState = undefined;

export function getCurrentState() {
    return currentState;
}

export function processUpdate(update) {
    currentState = update;
}
