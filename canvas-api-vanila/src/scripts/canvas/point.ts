export type dimension = 2 | 3;

export class Point {
    private _x: number = null;
    private _y: number = null;
    private _z: number = null;
    private _dimension: dimension = null;

    constructor(x: number, y: number, z?: number) {
        this._x = x;
        this._y = y;
        this._z = z || null;
        this._dimension = z == null ? 2 : 3;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        if (this._dimension == 2)
            throw new Error('dimension is 2. No z coordinates');
        return this._z;
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