import {vector, Vector} from "./vectorClass";
import {fixedLengthArray} from "../fixedLengthArray";
import {dimension} from "../Point/point";

export class Vector4D extends Vector {
    constructor(v: vector) {
        super(v);
    }

    protected static isDimensionEquals4(v1: Vector, v2: Vector) {
        return v1.dimension == 4 && v2.dimension == 4;
    }
}