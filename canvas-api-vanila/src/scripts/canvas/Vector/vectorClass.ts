//Хочу назвать vector.ts но phpstorm отказывается открывать этот файл
//Провозился 1.5 часа больше не могу на это время тратить

import {dimension, Point} from "../Point/point";
import {fixedLengthArray} from "../fixedLengthArray";


interface VectorPoints {
    p1:Point,
    p2:Point
}
// type test = fixedLengthArray<Point, 2>;
// let test: test = [new Point([1,1]), new Point([1,1])];

interface VectorObj {
    x: number,
    y: number,
    z?: number,
    w?: number
}

// export type vector2D = fixedLengthArray<number, 2> | VectorPoints;
// export type vector3D = fixedLengthArray<[number, number, number]> | VectorPoints;
// export type vector4D = fixedLengthArray<[number, number, number, number]> | VectorPoints;
// export type vector5D = fixedLengthArray<[number, number, number, number, number]> | VectorPoints;
//export type VectorPoints = fixedLengthArray<number, Point>;
export type vector = fixedLengthArray<number, dimension> | VectorPoints;

export class Vector {
    protected _vector: vector;

    protected readonly _dimension: dimension = null;

    constructor(v: vector) {
        if (Vector.instanceOfVectorPoints(v)) {
            if (Point.isDimensionEquals(v.p1, v.p2)) {
                this._dimension = v.p1.dimension;
                this.betweenPoints(v);
            } else
                throw new Error("Error with points dimension or with set dimension")
        } else {
            this._vector = v;
            this._dimension = v.length;
        }
    }

    private betweenPoints(v: VectorPoints) {
        let p1 = v.p1.point;
        let p2 = v.p2.point;

        let tmp = new Array(this._dimension);
        for (let i = 0; i < this._dimension; i++) {
            tmp[i] = p2[i] - p1[i];
        }
        //TODO Говнокод "as unknown as"
        this._vector = (tmp as unknown as fixedLengthArray<number, dimension>);
    }

    protected length(): number {
        let tmp = 0;
        for (let i = 0; i < this._dimension; i++) {
            tmp += Math.pow(this._vector[i], 2);
        }
        return Math.sqrt(tmp);
    }

    get positionObj(): VectorObj {
        let dimensionsName = ['x', 'y', 'z', 'w'];
        let obj: VectorObj = {
            x: null, y: null
        };
        for (let i = 0; i < this._dimension; i++) {
            obj[dimensionsName[i]] = this._vector[i];
        }
        return obj
    }

    get positionArr() {
        return this._vector;
    }

    public static sum(v1: Vector, v2: Vector): Vector /*Мы возвращаем Vector а создаем мы new Vector2D например, как быть? */ {
        if (Vector.isDimensionEquals(v1, v2)) {
            let tmp = new Array(v1._dimension);
            for (let i = 0; i < v1._dimension; i++) {
                tmp[i] = v1._vector[i] + v2._vector[i];
            }
            //TODO Говнокод "as unknown as"
            return new Vector((tmp as unknown as fixedLengthArray<number, dimension>));
        } else
            throw new Error("dimensions are not equal")
    }

    public static minus(v1: Vector, v2: Vector): Vector /*Мы возвращаем Vector а создаем мы new Vector2D например, как быть? */ {
        if (Vector.isDimensionEquals(v1, v2)) {
            let tmp = new Array(v1._dimension);
            for (let i = 0; i < v1._dimension; i++) {
                tmp[i] = v1._vector[i] - v2._vector[i];
            }
            //TODO Говнокод "as unknown as"
            return new Vector((tmp as unknown as fixedLengthArray<number, dimension>));
        } else
            throw new Error("dimensions are not equal")
    }

    public static scalarMultiplication(scalar: number, v: Vector) {
        let tmp = new Array(v._dimension);
        for (let i = 0; i < v._dimension; i++) {
            tmp[i] = v._vector[i] * scalar;
        }
        //TODO Говнокод "as unknown as"
        return new Vector((tmp as unknown as fixedLengthArray<number, dimension>));
    }

    public static scalarDivision(scalar: number, v: Vector) {
        let tmp = new Array(v._dimension);
        for (let i = 0; i < v._dimension; i++) {
            tmp[i] = v._vector[i] / scalar;
        }
        //TODO Говнокод "as unknown as"
        return new Vector((tmp as unknown as fixedLengthArray<number, dimension>));
    }

    public static scalarVectorMultiplication(v1: Vector, v2: Vector) {
        if (Vector.isDimensionEquals(v1, v2)) {
            let tmp: number = 0;
            for (let i = 0; i < v1._dimension; i++) {
                tmp += v1._vector[i] * v2._vector[i];
            }
            //TODO Говнокод "as unknown as"
            return tmp;
        } else
            throw new Error("dimensions are not equal")
    }

    public static normalization(v: Vector) {
        let tmp = new Array(v._dimension);
        for (let i = 0; i < v._dimension; i++) {
            tmp[i] = v._vector[i] / v.length();
        }
        //TODO Говнокод "as unknown as"
        return new Vector((tmp as unknown as fixedLengthArray<number, dimension>));
    }



    get dimension() {
        return this._dimension;
    }

    protected static isDimensionEquals(v1: Vector, v2: Vector) {
        return v1._dimension == v2._dimension;
    }

    private static instanceOfVectorPoints(obj: any): obj is VectorPoints {
        return (<VectorPoints>obj).p1 !== undefined;
    }
}




