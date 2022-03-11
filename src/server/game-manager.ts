import { Socket } from 'socket.io';
import { Direction, Input } from '../shared/model';
import { Player } from './player';

export class GameManager {


    private players = {}
    private sockets = {}
    private shouldUpdate = true; // send updates to the client at 30hz instead of 60hz
    private lastUpdate: number;  // keeps track of time of last update to calculate time difference
    private ready = 0;
    private counter = 4;
    private countDownInterval;
    private gameInterval;

    constructor() {
        this.lastUpdate = Date.now();
    }

    addPlayer(socket: Socket, username: string) {
        this.sockets[socket.id] = socket;
        const num = Object.keys(this.sockets).length;
        this.players[socket.id] = new Player(socket.id, num * 100, 100, Direction.UP, 0.1, username)
    }

    removePlayer(socket: Socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
        console.log("player removed", socket.id);
    }

    emitPlayers() {
        const players = Object.values(this.players).map((p :Player) => { 
            return {
                name: p.name, 
                color: p.color,
                ready: p.ready
            };
        });
        Object.values(this.sockets).forEach((socket: Socket) => {
            socket.emit('players', players);
        });
    }

    playerReady(socket: Socket) {
        this.ready += 1;

        this.players[socket.id].ready = true;
        this.emitPlayers();

        if (this.ready >= (Object.keys(this.sockets).length + 1) / 2) {
            this.countDownInterval = setInterval(this.countDown.bind(this), 1000);
        }
    }

    countDown() {
        this.counter -= 1;
        if (this.counter >= 0) {
            Object.values(this.sockets).forEach((socket: Socket) => {
                socket.emit('countDown', this.counter);
            });
        } else {
            Object.values(this.sockets).forEach((socket: Socket) => {
                socket.emit('start');
            });
            clearInterval(this.countDownInterval);
            this.gameInterval = setInterval(this.update.bind(this), 1000 / 60);
        }
    }

    private reset() {
        clearInterval(this.gameInterval);
        this.counter = 4;
        this.shouldUpdate = true;
        this.ready = 0;

        // reset player positions
        let c = 1;
        Object.values(this.players).forEach((player: Player) => {
            this.players[player.id].x = c*100;
            this.players[player.id].y = 100;
            this.players[player.id].dir = Direction.UP;
            this.players[player.id].ready = false;
            this.players[player.id].lost = false;
            this.players[player.id].trail = [{x: (c*100), y: 100}]
            c += 1;
        });

        Object.values(this.sockets).forEach((socket: Socket) => {
            socket.emit('reset');
        });
        this.emitPlayers();
    }

    handleInput(socket: Socket, input: Input) {
        const player = this.players[socket.id];
        
        if (!player) return;

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
            if (!player.lost) {
                playerMoveLines[player.id] = []
                playerMoveLines[player.id].push({x: player.x, y: player.y});
                if (player.move(dt)) {
                    playerMoveLines[player.id][0].x = -1;
                } else {
                    playerMoveLines[player.id].push({x: player.x, y: player.y});
                }
                
            }
            gameUpdate.players.push(player.serialize());
        });

        // detect collisions
        Object.values(this.players).forEach((player: Player) => {
            for (let i = 0; i < player.trail.length - 1; i++) {
                if (player.trail[i].x == -1 || player.trail[i+1].x == -1) continue;
                Object.values(this.players).forEach((p: Player) => {
                    if (!p.lost && playerMoveLines[p.id][0].x != -1) {
                        const points = playerMoveLines[p.id];
                        if (this.intersects(
                            points[0].x, points[0].y, 
                            points[1].x, points[1].y, 
                            player.trail[i].x, player.trail[i].y, 
                            player.trail[i+1].x, player.trail[i+1].y)) {
                            this.sockets[p.id].emit('gameOver', false);
                            p.lost = true;
                        }
                    }
                });
            }
            const i = player.trail.length - 1;
            Object.values(this.players).forEach((p: Player) => {
                if (!p.lost && playerMoveLines[p.id][0].x != -1) {
                    const points = playerMoveLines[p.id];
                    if (this.intersects(
                        points[0].x, points[0].y, 
                        points[1].x, points[1].y, 
                        player.trail[i].x, player.trail[i].y, 
                        player.x, player.y)) {
                        this.sockets[p.id].emit('gameOver', false);
                        p.lost = true;
                    }
                }
            });
        });

        let remaining = 0;
        let remainingPlayer: Player;
        Object.values(this.players).forEach((player: Player) => {
            if (!player.lost) {
                remaining += 1;
                remainingPlayer = player;
            }            
        });

        if (remaining <= 1) {
            if (remaining == 1) {
                this.sockets[remainingPlayer.id].emit('gameOver', true);
            }
            this.reset();            
        } 

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