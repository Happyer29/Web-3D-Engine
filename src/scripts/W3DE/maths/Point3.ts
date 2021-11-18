import {fixedLengthArray} from "../utils/fixedLengthArray";

export type point3 = fixedLengthArray<number, 3>;
export class Point3 {
    protected _point:point3;
    private readonly _dimension: number = 3;

    constructor(p: point3) {
        this._dimension = p.length;
        this._point = p;
    }

    get point(){
        return this._point;
    }

    get x() {
        return this._point[0];
    }

    get y() {
        return this._point[1];
    }

    get z() {
        return this._point[2];
    }

    public static sum(p1:Point3, p2:Point3){
        return new Point3([p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]])
    }
}