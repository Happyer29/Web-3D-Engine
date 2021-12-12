import {Point2} from "./Point2";
import {fixedLengthArray} from "../utils/fixedLengthArray";

interface Vector2Obj {
    x: number,
    y: number
}

export type vector2Points = fixedLengthArray<Point2, 2>// equal to [:Point2, :Point2]
export type vector2 = fixedLengthArray<number, 2>;

export class Vector2 {
    protected _vector: vector2;
    protected readonly _dimension: number = 2;
    private _x: number = 0;
    private _y: number = 0;

    constructor(v: vector2 | vector2Points) {
        if (Vector2.instanceOfVector2Points(v)) {
            this.betweenPoints(v);
        } else {
            this._vector = v;
        }
        this._x = this._vector[0];
        this._y = this._vector[1];
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set x(value: number) {
        this._x = value;
    }

    set y(value: number) {
        this._y = value;
    }

    private betweenPoints(v: vector2Points) {
        let p1 = v[0].point;
        let p2 = v[1].point;

        let tmp: vector2 = Vector2.zeroVector();
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

    get positionObj(): Vector2Obj {
        return {x: this._vector[0], y: this._vector[1]}
    }

    get positionArr() {
        return this._vector;
    }

    public static sum(v1: Vector2, v2: Vector2): Vector2 {
        let tmp: vector2 = Vector2.zeroVector();
        for (let i = 0; i < 2; i++) {
            tmp[i] = v1._vector[i] + v2._vector[i];
        }
        return new Vector2(tmp);
    }

    public static minus(v1: Vector2, v2: Vector2): Vector2 {
        let tmp: vector2 = Vector2.zeroVector();
        for (let i = 0; i < 2; i++) {
            tmp[i] = v1._vector[i] - v2._vector[i];
        }
        return new Vector2(tmp);
    }

    public static scalarMultiplication(scalar: number, v: Vector2) {
        let tmp: vector2 = Vector2.zeroVector();
        for (let i = 0; i < 2; i++) {
            tmp[i] = v._vector[i] * scalar;
        }
        return new Vector2(tmp);
    }

    public static scalarDivision(scalar: number, v: Vector2) {
        let tmp: vector2 = Vector2.zeroVector();
        for (let i = 0; i < 2; i++) {
            tmp[i] = v._vector[i] / scalar;
        }
        return new Vector2(tmp);
    }

    public static scalarVectorMultiplication(v1: Vector2, v2: Vector2) {
        let tmp: number = 0;
        for (let i = 0; i < 2; i++) {
            tmp += v1._vector[i] * v2._vector[i];
        }
        return tmp;
    }

    public static normalization(v: Vector2) {
        let tmp: vector2 = Vector2.zeroVector();
        for (let i = 0; i < 2; i++) {
            tmp[i] = v._vector[i] / v.length();
        }
        return new Vector2(tmp);
    }

    public static zeroVector(): vector2 {
        return [0, 0];
    }

    private static instanceOfVector2Points(obj: any): obj is vector2Points {
        return (<vector2Points>obj)[0] !== undefined;
    }
}