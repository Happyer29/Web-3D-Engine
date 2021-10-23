import { vector, Vector } from "./vectorClass";
export declare class Vector3D extends Vector {
    constructor(v: vector);
    static vectorMultiplication(v1: Vector3D, v2: Vector3D): Vector;
    protected static isDimensionEquals3(v1: Vector, v2: Vector): boolean;
}
