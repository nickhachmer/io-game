import { Socket } from 'socket.io';
import { Input } from '../shared/model';
import { Player } from './player';

export class GameManager {

    private players = {}
    private sockets = {}

    constructor() {
        setInterval(this.update.bind(this), 1000 / 30);
    }

    addPlayer(socket: Socket) {
        this.sockets[socket.id] = socket;
        this.players[socket.id] = new Player(socket.id, 100, 100, 0, 10, "test")
    }

    removePlayer(socket: Socket) {
        delete this.players[socket.id]
    }

    handleInput(socket: Socket, input: Input) {
        const player = this.players[socket.id];
        const speed = player.speed;
        
        if (input.up) {
            player.y -= speed;
        }
        if (input.down) {
            player.y += speed;
        }
        if (input.left) {
            player.x -= speed;
        }
        if (input.right) {
            player.x += speed;
        }
    }

    update() {

        const gameUpdate = {
            players: []
        };
        
        Object.values(this.players).forEach((player: Player) => {
            gameUpdate.players.push(player.serialize());
        });

        Object.values(this.sockets).forEach((socket: Socket) => {
            socket.emit('serverUpdate', gameUpdate);
        });
    }
}