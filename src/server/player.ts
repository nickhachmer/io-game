import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../shared/constants';
import { Direction, Point } from '../shared/model';
import { GameObject } from './game-object';

export class Player extends GameObject {
    name: string;
    dir: Direction;
    speed: number;
    trail: Point[];

    constructor(id, x, y, dir, speed, name) {
        super(id, x, y);
        this.name = name
        this.dir = dir;
        this.speed = speed;
        this.trail = [{x, y}];
    }

    move(dt: number): void {
        switch(this.dir) {
            case Direction.UP: this.y -= (this.speed * dt); break;
            case Direction.DOWN: this.y += (this.speed * dt); break;
            case Direction.LEFT: this.x -= (this.speed * dt); break;
            case Direction.RIGHT: this.x += (this.speed * dt); break;
        }
        this.checkPlayerInBoundaries();
    }

    private checkPlayerInBoundaries(): void {
        if (this.x < 0) {
            this.trail.push({x: 1, y: this.y})
            this.trail.push({x: -1, y: -1})

            this.x = CANVAS_WIDTH-1
            this.trail.push({x: CANVAS_WIDTH-1, y: this.y})
        } else if (this.x >= CANVAS_WIDTH) {
            this.trail.push({x: CANVAS_WIDTH-1, y: this.y})
            this.trail.push({x: -1, y: -1})

            this.x = 1
            this.trail.push({x: 1, y: this.y})
        } else if (this.y < 0) {
            this.trail.push({x: this.x, y: 1})
            this.trail.push({x: -1, y: -1})

            this.y = CANVAS_HEIGHT-1
            this.trail.push({x: this.x, y: CANVAS_HEIGHT-1})
        } else if (this.y >= CANVAS_HEIGHT) {
            this.trail.push({x: this.x, y: CANVAS_HEIGHT-1})
            this.trail.push({x: -1, y: -1})

            this.y = 1
            this.trail.push({x: this.x, y: 1})
        }
    }

    override serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            dir: this.dir,
            trail: this.trail,
        };
    }

}