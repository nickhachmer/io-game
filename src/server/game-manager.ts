import { Socket } from 'socket.io';
import { Input } from '../shared/model';
import { Player } from './player';

export class GameManager {

    private players = {}
    private sockets = {}

    constructor() {
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket: Socket) {
        this.sockets[socket.id] = socket;
        this.players[socket.id] = new Player(socket.id, 0, 0, 0, 10, "test")
    }

    removePlayer(socket: Socket) {
        delete this.players[socket.id]
    }

    handleInput(input: Input) {
        return input;
    }

    update() {
        return undefined
    }
}