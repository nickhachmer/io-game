export class GameObject {
    id: string;
    x: number;
    y: number;
    dir: number;
    speed: number;

    constructor(id, x, y, dir, speed) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = speed;
    }

    serialize() {
        return undefined;
    }

}