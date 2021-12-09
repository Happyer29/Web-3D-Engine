import {Point3} from "./Point3";
import {fixedLengthArray} from "../utils/fixedLengthArray";

interface Vector3Obj {
    x: number,
    y: number,
    z: number
}

export type vector3Points = fixedLengthArray<Point3, 2>// equal to [:Point3, :Point3]
export type vector3 = fixedLengthArray<number, 3>;

export class Vector3 {
    protected _vector: vector3;
    protected readonly _dimension: number = 3;
    private _x:number = 0;
    private _y:number = 0;
    private _z:number = 0;

    constructor(v: vector3 | vector3Points) {
        if (Vector3.instanceOfVector3Points(v)) {
            this.betweenPoints(v);
        } else {
            this._vector = v;
        }
        this._x = this._vector[0];
        this._y = this._vector[1];
        this._z = this._vector[2];
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

    private betweenPoints(v: vector3Points) {
        let p1 = v[0].point;
        let p2 = v[1].point;

        let tmp: vector3 = Vector3.zeroVector();
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

    get positionObj(): Vector3Obj {
        return {x: this._vector[0], y: this._vector[1], z: this._vector[2]}
    }

    get positionArr() {
        return this._vector;
    }

    public static sum(v1: Vector3, v2: Vector3): Vector3 {
        let tmp: vector3 = Vector3.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v1._vector[i] + v2._vector[i];
        }
        return new Vector3(tmp);
    }

    public static minus(v1: Vector3, v2: Vector3): Vector3 {
        let tmp: vector3 = Vector3.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v1._vector[i] - v2._vector[i];
        }
        return new Vector3(tmp);
    }

    public static scalarMultiplication(scalar: number, v: Vector3) {
        let tmp: vector3 = Vector3.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] * scalar;
        }
        return new Vector3(tmp);
    }

    public static scalarDivision(scalar: number, v: Vector3) {
        let tmp: vector3 = Vector3.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] / scalar;
        }
        return new Vector3(tmp);
    }

    public static scalarVectorMultiplication(v1: Vector3, v2: Vector3) {
        let tmp: number = 0;
        for (let i = 0; i < 3; i++) {
            tmp += v1._vector[i] * v2._vector[i];
        }
        return tmp;
    }

    public static normalization(v: Vector3) {
        let tmp: vector3 = Vector3.zeroVector();
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] / v.length();
        }
        return new Vector3(tmp);
    }

    public static zeroVector(): vector3 {
        return [0, 0, 0];
    }

    private static instanceOfVector3Points(obj: any): obj is vector3Points {
        return (<vector3Points>obj)[0] !== undefined;
    }
}




