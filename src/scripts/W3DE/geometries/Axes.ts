import { Geometry } from "./Geometry";

export class Axes extends Geometry {
    constructor(size: number) {
        const vertices = [
            -size, 0, 0, size, 0, 0,
            0, -size, 0, 0, size, 0,
            0, 0, -size, 0, 0, size,
        ];

        super(vertices, vertices, vertices);
    }
}