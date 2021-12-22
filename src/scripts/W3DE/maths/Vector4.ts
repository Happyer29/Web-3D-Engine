import {Point4} from "./Point4";
import {fixedLengthArray} from "../utils/fixedLengthArray";
import {vector3Points} from "./Vector3";

interface Vector4Obj {
    x: number,
    y: number,
    z: number,
    w: number
}

export type vector4Points = fixedLengthArray<Point4, 2>// equal to [:Point3, :Point3]
export type vector4 = fixedLengthArray<number, 4>;

export class Vector4 {
    protected _vector: vector4;
    protected readonly _dimension: number = 4;
    private _x:number = 0;
    private _y:number = 0;
    private _z:number = 0;
    private _w:number = 0;

    constructor(v: vector4 | vector4Points) {
        if (Vector4.instanceOfVector4Points(v)) {
            this.betweenPoints(v);
        } else {
            this._vector = v;
        }
        this._x = this._vector[0];
        this._y = this._vector[1];
        this._z = this._vector[2];
        this._w = this._vector[3];
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get z(): number {
        return this._z;
    }

    set z(value: number) {
        this._z = value;
    }

    get w(): number {
        return this._w;
    }

    set w(value: number) {
        this._w = value;
    }

    private betweenPoints(v: vector4Points) {
        let p1 = v[0].point;
        let p2 = v[1].point;

        let tmp: vector4 = Vector4.zeroVector();
        for (let i = 0; i < this._dimension; i++) {
            tmp[i] = p2[i] - p1[i];
        }
        this._vector = tmp;
    }

    public length(): number {
        let tmp = 0;
        for (let i = 0; i < this._dimension; i++) {
            tmp += Math.pow(this._vector[i], 2);
        }
        return Math.sqrt(tmp);
    }

    get positionObj(): Vector4Obj {
        return {x: this._vector[0], y: this._vector[1], z: this._vector[2], w: this._vector[3]}
    }

    get positionArr() {
        return Array.from(this._vector);
    }

    public static sum(v1: Vector4, v2: Vector4): Vector4 {
        let tmp: vector4 = Vector4.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v1._vector[i] + v2._vector[i];
        }
        return new Vector4(tmp);
    }

    public static minus(v1: Vector4, v2: Vector4): Vector4 {
        let tmp: vector4 = Vector4.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v1._vector[i] - v2._vector[i];
        }
        return new Vector4(tmp);
    }

    public static scalarMultiplication(scalar: number, v: Vector4) {
        let tmp: vector4 = Vector4.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] * scalar;
        }
        return new Vector4(tmp);
    }

    public static scalarDivision(scalar: number, v: Vector4) {
        let tmp: vector4 = Vector4.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] / scalar;
        }
        return new Vector4(tmp);
    }

    public static scalarVectorMultiplication(v1: Vector4, v2: Vector4) {
        let tmp: number = 0;
        for (let i = 0; i < 3; i++) {
            tmp += v1._vector[i] * v2._vector[i];
        }
        return tmp;
    }

    public static normalization(v: Vector4) {
        let tmp: vector4 = Vector4.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] / v.length();
        }
        return new Vector4(tmp);
    }

    public static zeroVector(): vector4 {
        return [0, 0, 0, 0];
    }

    private static instanceOfVector4Points(obj: any): obj is vector4Points {
        return (<vector4Points>obj[0].w) !== undefined;
    }
}




