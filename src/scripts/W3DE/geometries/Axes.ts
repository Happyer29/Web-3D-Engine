import { Object3D } from "../core/Object3D";
import { Geometry } from "./Geometry";

export class Axes extends Object3D {
    constructor(size : number) {
        const vertices = [
            -size,0,0, size,0,0,
            0,-size,0, 0,size,0,
            0,0,-size, 0,0,size
             ] ;
        let geometry = new Geometry(vertices, vertices, vertices);
        
        super(geometry);
    }
}