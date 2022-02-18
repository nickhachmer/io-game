import { GameObject } from './game-object';

export class Player extends GameObject {
    name: string;

    constructor(id, x, y, dir, speed, name) {
        super(id, x, y, dir, speed);
        this.name = name
    }

    renderTrail() {
        return undefined;
    }

    override serialize() {
        return undefined;
    }

}