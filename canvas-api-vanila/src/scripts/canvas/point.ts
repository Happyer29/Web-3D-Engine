export type dimension = 2 | 3 | 4;

export class Point {
    private readonly _x: number = null;
    private readonly _y: number = null;
    private readonly _z: number = null;
    private readonly _w: number = null;
    private _dimension: dimension = null;

    constructor(x: number, y: number, z?: number, w?: number) {
        this._x = x;
        this._y = y;
        this._z = z || null;
        this._w = w || null;
        this.setDimension(x,y,z,w);
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

    get w() {
        if (this._dimension == 3)
            throw new Error('dimension is 3. No w coordinates');
        return this._w;
    }

    get dimension() {
        return this._dimension;
    }

    private setDimension(x: number, y: number, z?: number, w?: number){
        if(z == null)
            this._dimension = 2
        else
            if (w == null)
                this._dimension = 3
            else
                this._dimension = 4
    }

    //если указано пространство, сверяет точки с пространством
    //если не указано, сверяет пространства точек
    public static isDimensionEquals(p1: Point, p2: Point, dimension?: dimension) {
        return dimension ? dimension == p1._dimension && dimension == p2._dimension : p1._dimension == p2._dimension;
    }
}