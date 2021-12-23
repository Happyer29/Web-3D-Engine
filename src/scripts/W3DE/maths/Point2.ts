import {fixedLengthArray} from "../utils/fixedLengthArray";

export type point2 = fixedLengthArray<number, 2>;
export class Point2 {
    protected _point:point2;
    private readonly _dimension: number = 2;

    constructor(p: point2) {
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

    public static sum(p1:Point2, p2:Point2){
        return new Point2([p1.x + p2.x, p1.y + p2.y])
    }
}