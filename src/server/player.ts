import { GameObject } from './game-object';

export class Player extends GameObject {
    name: string;
    dir: number;
    speed: number;

    constructor(id, x, y, dir, speed, name) {
        super(id, x, y);
        this.name = name
        this.dir = dir;
        this.speed = speed;
    }

}