
const RENDER_DELAY = 10; // 100 ms
const gameUpdates = [];

let gameStartTime = 0;
let firstServerTimeStamp = 0;

export function initState() {
    gameStartTime = 0;
    firstServerTimeStamp = 0;
}

export function processUpdate(update) {
    if (!firstServerTimeStamp) {
        firstServerTimeStamp = update.serverTime;
        gameStartTime = Date.now();
    }
    gameUpdates.push(update);

    let base = getBaseUpdate();
    if (base > 0) {
        // remove all updates that are before the mose recent update (accounting for the delay)
        gameUpdates.slice(0, base);
    }
}

function currentServerTime() {
    return firstServerTimeStamp + (Date.now() - gameStartTime) - RENDER_DELAY;
}

function getBaseUpdate() {
    // find the index of the update that is the most recent (accounting for the delay).
    const time = currentServerTime();
    for (let i = gameUpdates.length - 1; i >= 0; i--) {
        if (gameUpdates[i].serverTime <= time) {
            return i;
        }
    }
    return -1;
}

export function getCurrentState() {
    if (!firstServerTimeStamp) {
        // have not recieve a server update
        return {}
    }

    const base = getBaseUpdate();
    if (base < 0 || base === gameUpdates.length - 1) { 
        // there are updates more recent than the last update recieved from the server
        // base < 0 is edge case occuring when the game just begins and we recieved the first update
        return gameUpdates[base];
    } else {
        // otherwise we interpolate between the base update and the next one.
        const baseUpdate = gameUpdates[base];
        const nextUpdate = gameUpdates[base + 1];
        const ratio = (currentServerTime() - baseUpdate.serverTime) / (nextUpdate.serverTime - baseUpdate.serverTime);
        return {
            players: interpolatePlayers(baseUpdate.players, nextUpdate.players, ratio)
        }

    }
}

function interpolatePlayers(baseUpdatePlayers, nextUpdatePlayers, ratio) {
    // very simple for now, just find the mid point
    return baseUpdatePlayers.map(player => {
        const newerPlayer = nextUpdatePlayers.find(x => x.id === player.id);
        player.x = player.x + (newerPlayer.x - player.x) * ratio;
        player.y = player.y + (newerPlayer.y - player.y) * ratio;
        return player;
    })
}