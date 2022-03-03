import { Direction } from '../shared/model';
import { GameObject } from './game-object';

export class Player extends GameObject {
    name: string;
    dir: Direction;
    speed: number;

    constructor(id, x, y, dir, speed, name) {
        super(id, x, y);
        this.name = name
        this.dir = dir;
        this.speed = speed;
    }

    move(dt: number): void {
        switch(this.dir) {
            case Direction.UP: this.y -= (this.speed * dt); break;
            case Direction.DOWN: this.y += (this.speed * dt); break;
            case Direction.LEFT: this.x -= (this.speed * dt); break;
            case Direction.RIGHT: this.x += (this.speed * dt); break;
        }
    }

    override serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            dir: this.dir,
        };
    }

}