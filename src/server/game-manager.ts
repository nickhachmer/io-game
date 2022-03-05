import { Socket } from 'socket.io';
import { Direction, Input } from '../shared/model';
import { Player } from './player';

const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 800;

export class GameManager {


    private players = {}
    private sockets = {}
    private shouldUpdate = true; // send updates to the client at 30hz instead of 60hz
    private lastUpdate: number;  // keeps track of time of last update to calculate time difference


    constructor() {
        this.lastUpdate = Date.now();
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket: Socket) {
        this.sockets[socket.id] = socket;
        this.players[socket.id] = new Player(socket.id, 100, 100, Direction.UP, 0.1, "test")
    }

    removePlayer(socket: Socket) {
        delete this.players[socket.id]
    }

    handleInput(socket: Socket, input: Input) {
        const player = this.players[socket.id];
        
        if (input.up && player.dir != Direction.DOWN) {
            player.dir = Direction.UP;
        }
        if (input.down && player.dir != Direction.UP) {
            player.dir = Direction.DOWN;
        }
        if (input.left && player.dir != Direction.RIGHT) {
            player.dir = Direction.LEFT;
        }
        if (input.right && player.dir != Direction.LEFT) {
            player.dir = Direction.RIGHT;
        }
    }

    checkPlayerInBoundaries(player: Player): void {
        if (player.x < 0 || player.x > CANVAS_WIDTH || 
            player.y < 0 || player.y > CANVAS_HEIGHT) {
                this.sockets[player.id].emit("gameOver");
        }
    }

    update() {
        const now = Date.now();
        const dt = now - this.lastUpdate;
        this.lastUpdate = now
        const gameUpdate = {
            serverTime: now,
            players: []
        };
        
        Object.values(this.players).forEach((player: Player) => {
            this.checkPlayerInBoundaries(player);
            player.move(dt);
            gameUpdate.players.push(player.serialize());
        });

        if (this.shouldUpdate) {
            this.shouldUpdate = false;
            Object.values(this.sockets).forEach((socket: Socket) => {
                socket.emit('serverUpdate', gameUpdate);
            });
        } else {
            this.shouldUpdate = true;
        }
    }
}