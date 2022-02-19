export class GameObject {
    id: string;
    x: number;
    y: number;

    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    serialize() {
        return {
            id: this.id,
            x: this.x,
            y: this.y 
        };
    }

}