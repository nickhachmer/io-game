import { startCapturingInput, stopCapturingInput } from "./input";
import { connect, joinGame, ready } from "./networking";
import { startRendering, stopRendering } from "./render";

import './css/main.css';

const mainMenu = document.getElementById("main-menu");
const lobby = document.getElementById("lobby");
const canvas = document.getElementById('game-canvas');

const userNameInput = document.getElementById("username-input");
const playerList = document.getElementById("player-list");

const joinBtn = document.getElementById("join-btn");
const readyBtn = document.getElementById("ready-btn");

const counter = document.getElementById("counter");

const lostMessage = document.getElementById("lost-message");
const winMessage = document.getElementById("win-message");

joinBtn.addEventListener("click", () => {
    mainMenu.classList.add('hidden');
    lobby.classList.remove("hidden");
    const username = userNameInput.value;
    Promise.resolve(connect(onGameOver)).then(() => {
        joinGame(username);
        readyBtn.addEventListener("click", () => {
            readyBtn.classList.add('hidden');
            ready();
        });
    })
});

export const reset = () => {
    stopCapturingInput();
    stopRendering();
    counter.innerHTML = "";
    counter.classList.remove("hidden");
    lobby.classList.remove("hidden");
    canvas.classList.add("hidden");
    readyBtn.classList.remove('hidden');
}

export const startGame = () => {
    lobby.classList.add("hidden");
    counter.classList.add("hidden");
    canvas.classList.remove("hidden");
    console.log("stating ----------");
    startCapturingInput();
    startRendering();
}

const onGameOver = (won) => {
    stopCapturingInput();
    if (won) {
        console.log("won");
        winMessage.classList.remove("hidden");
    } else {
        console.log("lost");
        lostMessage.classList.remove("hidden");
    }
    
}

export const displayPlayers = (players) => {
    playerList.innerHTML = "";
    console.log(players);
    players.map(p => {
        const ready = p.ready ? "bg-success" : "";
        playerList.innerHTML += "<li class='list-group-item " + ready + "'>" + p.name + " <span class='badge' style='float: right; background:" + p.color + "'>&nbsp;</span></li>";
    });
}

export const countDown = (num) => {
    counter.innerHTML = num;
}