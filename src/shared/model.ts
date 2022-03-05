export enum Direction {
    UP, DOWN, LEFT, RIGHT
}

export type Input = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

export type Point = {
    x: number;
    y: number;
}