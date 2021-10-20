import {fixedLengthArray} from "../fixedLengthArray";

export type dimension = 2 | 3 | 4;


export type point = fixedLengthArray<number, dimension>;

export class Point {
    protected _point:point;
    private readonly _dimension: dimension = null;

    constructor(p: point) {
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
        if (this._dimension == 2)
            throw new Error('dimension is 2. No z coordinates');
        return this._point[2];
    }

    get w() {
        if (this._dimension == 3)
            throw new Error('dimension is 3. No w coordinates');
        return this._point[3];
    }

    get dimension() {
        return this._dimension;
    }

    //если указано пространство, сверяет точки с пространством
    //если не указано, сверяет пространства точек
    public static isDimensionEquals(p1: Point, p2: Point, dimension?: dimension) {
        return dimension ? dimension == p1._dimension && dimension == p2._dimension : p1._dimension == p2._dimension;
    }
}