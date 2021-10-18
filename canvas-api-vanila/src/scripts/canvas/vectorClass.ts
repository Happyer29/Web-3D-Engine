//Хочу назвать vector.ts но phpstorm отказывается открывать этот файл
//Провозился 1.5 часа больше не могу на это время тратить

import {dimension, Point} from "./point";

interface VectorPoints {
    p1: Point,
    p2: Point
}

interface VectorCoordinates {
    x: number,
    y: number,
    z?: number,
}

export type vectorCreate = VectorPoints | VectorCoordinates;

export class Vector {
    private _x: number = null;
    private _y: number = null;
    private _z: number = null;
    private readonly _dimension: dimension = null;

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
        }
    }

    get position() {
        return {
            x: this._x,
            y: this._y,
            z: this._z,
        }
    }

    private betweenPoints(v: VectorPoints) {
        this._x = v.p2.x - v.p1.x;
        this._y = v.p2.y - v.p1.y;
        this._z = this._dimension == 3 ? v.p2.z - v.p1.z : null;

    }

    private static instanceOfVectorPoints(obj: any): obj is VectorPoints {
        return (<VectorPoints>obj).p1 !== undefined;
    }
}




