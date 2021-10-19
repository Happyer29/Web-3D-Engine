//Хочу назвать vector.ts но phpstorm отказывается открывать этот файл
//Провозился 1.5 часа больше не могу на это время тратить

import {dimension, Point} from "../point";

interface VectorPoints {
    p1: Point,
    p2: Point
}

interface VectorCoordinates {
    x: number,
    y: number,
    z?: number,
    w?: number,
}

type vector = Array<number>[dimension]

export type vectorCreate = VectorPoints | VectorCoordinates;

export class Vector {
    protected _x: number = null;
    protected _y: number = null;
    protected _z: number = null;
    protected _w: number = null;
    protected readonly _dimension: dimension = null;

    // constructor(v: vector, dimension?: dimension) {
    //     if (Vector.instanceOfVectorPoints(v)) {
    //         if (Point.isDimensionEquals(v.p1, v.p2, dimension)) {
    //             this._dimension = v.p1.dimension;
    //             this.betweenPoints(v);
    //         } else
    //             throw new Error("Error with points dimension or with set dimension")
    //     } else {
    //         this._x = v.x;
    //         this._y = v.y;
    //         this._z = v.z || null;
    //         this._w = v.w || null;
    //     }
    // }
    constructor(v: vectorCreate, dimension?: dimension) {
        if (Vector.instanceOfVectorPoints(v)) {
            if (Point.isDimensionEquals(v.p1, v.p2, dimension)) {
                this._dimension = v.p1.dimension;
                this.betweenPoints(v);
            } else
                throw new Error("Error with points dimension or with set dimension")
        } else {
            this._x = v.x;
            this._y = v.y;
            this._z = v.z || null;
            this._w = v.w || null;
        }
    }

    private betweenPoints(v: VectorPoints) {
        this._x = v.p2.x - v.p1.x;
        this._y = v.p2.y - v.p1.y;
        this._z = this._dimension >= 3 ? v.p2.z - v.p1.z : null;
        this._w = this._dimension == 4 ? v.p2.w - v.p1.w : null;
    }

    protected length():number{
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2) + Math.pow(this._z, 2) + Math.pow(this._w, 2))
    }

    // protected getUnitVector(){
    //     return {
    //         x: this._x/this.length(),
    //         y: this._y/this.length(),
    //         z: this._z/this.length(),
    //         w: this._w/this.length()
    //     };
    // }

    get position(){
        return new Vector({
            x: this._x,
            y: this._y,
            z: this._z,
            w: this._w,
        }, this._dimension)
    }

    // protected static sum(v1:Vector, v2:Vector){
    //     return new Vector({
    //         x: v1.x + v2.x,
    //         y: v1.x + v2.x,
    //         z: v1.x + v2.x,
    //         w: v1.x + v2.x,
    //     });
    // }

    private static instanceOfVectorPoints(obj: any): obj is VectorPoints {
        return (<VectorPoints>obj).p1 !== undefined;
    }
}




