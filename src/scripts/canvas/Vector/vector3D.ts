import {vector, Vector} from "./vectorClass";
import {fixedLengthArray} from "../fixedLengthArray";
import {dimension} from "../Point/point";

export class Vector3D extends Vector {
    constructor(v: vector) {
        super(v);
    }

    public static vectorMultiplication(v1: Vector3D, v2: Vector3D) {
        if (Vector3D.isDimensionEquals3(v1, v2)) {
            let tmp = new Array(v1._dimension);
            let pos1 = v1.positionObj;
            let pos2 = v2.positionObj;
            tmp[0] = pos1.y * pos2.z - pos1.z * pos2.y;
            tmp[1] = -(pos1.x * pos2.z - pos1.z * pos2.x);
            tmp[2] = pos1.x * pos2.y - pos1.y * pos2.x;
            //TODO Говнокод "as unknown as"
            return new Vector((tmp as unknown as fixedLengthArray<number, dimension>));
        } else
            throw new Error("dimension error")
    }

    protected static isDimensionEquals3(v1: Vector, v2: Vector) {
        return v1.dimension == 3 && v2.dimension == 3;
    }
}