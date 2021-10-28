import {Point3} from "./Point3";
import {fixedLengthArray} from "../utils/fixedLengthArray";

//TODO сейчас мы можем передавать точки только в жестком интерфейсе
//{p1: , p2: } - нужно это исправить чтобы можно было передавать поинты через массив
interface Vector3Points {
    p1: Point3,
    p2: Point3
}

interface Vector3Obj {
    x: number,
    y: number,
    z: number
}

//export type vector3Points = fixedLengthArray<Point3, 2>;
export type vector3 = fixedLengthArray<number, 3> | Vector3Points;

export class Vector3 {
    protected _vector: vector3;
    protected readonly _dimension: number = 3;

    constructor(v: vector3) {
        if (Vector3.instanceOfVector3Points(v)) {
            this.betweenPoints(v);
        } else {
            this._vector = v;
        }
    }

    private betweenPoints(v: Vector3Points) {
        let p1 = v.p1.point;
        let p2 = v.p2.point;

        let tmp = new Array(this._dimension);
        for (let i = 0; i < this._dimension; i++) {
            tmp[i] = p2[i] - p1[i];
        }
        //TODO Говнокод "as unknown as"
        this._vector = (tmp as unknown as fixedLengthArray<number, 3>);
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
        let tmp: vector3 = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            tmp[i] = v1._vector[i] + v2._vector[i];
        }
        return new Vector3(tmp);
    }

    public static minus(v1: Vector3, v2: Vector3): Vector3 {
        let tmp: vector3 = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            tmp[i] = v1._vector[i] - v2._vector[i];
        }
        //TODO Говнокод "as unknown as"
        return new Vector3(tmp);
    }

    public static scalarMultiplication(scalar: number, v: Vector3) {
        let tmp: vector3 = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] * scalar;
        }
        //TODO Говнокод "as unknown as"
        return new Vector3(tmp);
    }

    public static scalarDivision(scalar: number, v: Vector3) {
        let tmp: vector3 = [0, 0, 0];
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
        let tmp: vector3 = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            tmp[i] = v._vector[i] / v.length();
        }
        return new Vector3(tmp);
    }

    public static zeroVector() {
        return Array.from({length: 3}, _ => 0);
    }

    private static instanceOfVector3Points(obj: any): obj is Vector3Points {
        return (<Vector3Points>obj).p1 !== undefined;
    }
}




