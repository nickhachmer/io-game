import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../shared/constants';
import { Direction, Point } from '../shared/model';
import { GameObject } from './game-object';

let colorIdx = 0;
const colors = ["green", "blue", "yellow", "black", "grey", "purple"];

export class Player extends GameObject {
    name: string;
    dir: Direction;
    speed: number;
    trail: Point[];
    ready: boolean;
    color: string;
    lost: boolean;

    constructor(id, x, y, dir, speed, name) {
        super(id, x, y);
        this.name = name
        this.dir = dir;
        this.speed = speed;
        this.trail = [{x: x, y: y}];
        this.ready = false;
        this.lost = false;

        this.color = colors[colorIdx];
        colorIdx += 1;
        if (colorIdx >= colors.length) {
            colorIdx = 0
        }
    }

    move(dt: number): boolean {
        switch(this.dir) {
            case Direction.UP: this.y -= (this.speed * dt); break;
            case Direction.DOWN: this.y += (this.speed * dt); break;
            case Direction.LEFT: this.x -= (this.speed * dt); break;
            case Direction.RIGHT: this.x += (this.speed * dt); break;
        }
        return this.checkPlayerInBoundaries();
    }

    private checkPlayerInBoundaries(): boolean {
        if (this.x < 0) {
            this.trail.push({x: 1, y: this.y});
            this.trail.push({x: -1, y: -1});

            this.x = CANVAS_WIDTH-1;
            this.trail.push({x: CANVAS_WIDTH-1, y: this.y});
            return true;
        } else if (this.x >= CANVAS_WIDTH) {
            this.trail.push({x: CANVAS_WIDTH-1, y: this.y});
            this.trail.push({x: -1, y: -1});

            this.x = 1;
            this.trail.push({x: 1, y: this.y});
            return true;
        } else if (this.y < 0) {
            this.trail.push({x: this.x, y: 1});
            this.trail.push({x: -1, y: -1});

            this.y = CANVAS_HEIGHT-1;
            this.trail.push({x: this.x, y: CANVAS_HEIGHT-1});
            return true;
        } else if (this.y >= CANVAS_HEIGHT) {
            this.trail.push({x: this.x, y: CANVAS_HEIGHT-1});
            this.trail.push({x: -1, y: -1});

            this.y = 1
            this.trail.push({x: this.x, y: 1})
            return true;
        }
        return false;
    }

    override serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            dir: this.dir,
            trail: this.trail,
            color: this.color,
        };
    }

}