import {fixedLengthArray} from "../utils/fixedLengthArray";

export type point4 = fixedLengthArray<number, 4>;
export class Point4 {
    protected _point:point4;
    private readonly _dimension: number = 4;

    constructor(p: point4) {
        this._dimension = p.length; //TODO это имеет смысл тут находиться???????
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

    get w() {
        return this._point[3];
    }

    public static sum(p1:Point4, p2:Point4){
        return new Point4([p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2], p1[3] + p2[3]])
    }
}