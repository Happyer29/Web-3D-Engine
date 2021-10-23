import { vector, Vector } from "./vectorClass";
export declare class Vector4D extends Vector {
    constructor(v: vector);
    protected static isDimensionEquals4(v1: Vector, v2: Vector): boolean;
}
