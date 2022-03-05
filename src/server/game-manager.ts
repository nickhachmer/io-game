import { Socket } from 'socket.io';
import { Direction, Input } from '../shared/model';
import { Player } from './player';

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
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    handleInput(socket: Socket, input: Input) {
        const player = this.players[socket.id];
        
        const position = { x: player.x, y: player.y };

        if (input.up && player.dir != Direction.DOWN) {
            player.dir = Direction.UP;
            player.trail.push(position)
        }
        if (input.down && player.dir != Direction.UP) {
            player.dir = Direction.DOWN;
            player.trail.push(position)
        }
        if (input.left && player.dir != Direction.RIGHT) {
            player.dir = Direction.LEFT;
            player.trail.push(position)
        }
        if (input.right && player.dir != Direction.LEFT) {
            player.dir = Direction.RIGHT;
            player.trail.push(position)
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
        
        // move players
        const playerMoveLines = {};
        Object.values(this.players).forEach((player: Player) => {
            playerMoveLines[player.id] = []
            playerMoveLines[player.id].push({x: player.x, y: player.y});
            player.move(dt);
            playerMoveLines[player.id].push({x: player.x, y: player.y});
            gameUpdate.players.push(player.serialize());
        });

        // detect collisions
        Object.values(this.players).forEach((player: Player) => {
            for (let i = 0; i < player.trail.length - 1; i++) {
                if (player.trail[i].x == -1 || player.trail[i+1].x == -1) continue;
                Object.values(this.players).forEach((p: Player) => {
                    const points = playerMoveLines[p.id];
                    if (this.intersects(
                        points[0].x, points[0].y, 
                        points[1].x, points[1].y, 
                        player.trail[i].x, player.trail[i].y, 
                        player.trail[i+1].x, player.trail[i+1].y)) {
                        this.sockets[p.id].emit('gameOver');
                    }
                });
            }
            const i = player.trail.length - 1;
            Object.values(this.players).forEach((p: Player) => {
                const points = playerMoveLines[p.id];
                if (this.intersects(
                    points[0].x, points[0].y, 
                    points[1].x, points[1].y, 
                    player.trail[i].x, player.trail[i].y, 
                    player.x, player.y)) {
                    this.sockets[p.id].emit('gameOver');
                }
            });
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

    private intersects(a,b,c,d,p,q,r,s) {
        // credit https://stackoverflow.com/a/24392281
        const det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }
}