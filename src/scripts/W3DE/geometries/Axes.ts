import { Object3D } from "../core/Object3D";
import { Line } from "../objects/Line";
import { Material } from "../W3DE";
import { Geometry } from "./Geometry";

export class Axes extends Line {
    constructor(size: number) {
        const vertices = [
            -size, 0, 0, size, 0, 0,
            -size / 2, -size / 2, 0, size / 2, -size / 2, 0,
            0, -size, 0, 0, size, 0,
            0, 0, -size, 0, 0, size,
        ];
        let geometry = new Geometry(vertices, vertices, vertices);
        super(geometry);
    }
}