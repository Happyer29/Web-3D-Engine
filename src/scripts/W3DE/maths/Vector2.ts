import {Point2} from "./Point2";
import {fixedLengthArray} from "../utils/fixedLengthArray";
import {Warning} from "postcss";

interface Vector2Obj {
    x: number,
    y: number
}

export type vector2Points = fixedLengthArray<Point2, 2>// equal to [:Point2, :Point2]
export type vector2 = fixedLengthArray<number, 2>;

export class Vector2 {
    protected readonly _dimension: number = 2;
    private _x: number = 0;
    private _y: number = 0;

    constructor(v: vector2 | vector2Points = [0,0]){
        if (typeof v[0] === "number" && typeof v[1] === "number") {
            this.setArrayToVector(v as vector2);
        } else {
            this.betweenPoints(v as vector2Points);
        }
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
        this.setArrayToVector(tmp);
    }

    //На вход передаем массив значений, который присваивается вектору
    private setArrayToVector(arr:vector2){
        this.x = arr[0];
        this.y = arr[1];
    }

    public length(): number {
        let tmp = 0;
        let arr = this.positionArr;
        for (let i = 0; i < this._dimension; i++) {
            tmp += Math.pow(arr[i], 2);
        }
        return Math.sqrt(tmp);
    }

    get positionObj(): Vector2Obj {
        return {x: this.x, y: this.y}
    }

    get positionArr() {
        return [this.x, this.y];
    }

    public static sum(v1: Vector2, v2: Vector2): Vector2 {
        let tmp: vector2 = Vector2.zeroVector();
        let arr1 = v1.positionArr;
        let arr2 = v2.positionArr;
        for (let i = 0; i < 2; i++) {
            tmp[i] = arr1[i] + arr2[i];
        }
        return new Vector2(tmp);
    }

    public static minus(v1: Vector2, v2: Vector2): Vector2 {
        let tmp: vector2 = Vector2.zeroVector();
        let arr1 = v1.positionArr;
        let arr2 = v2.positionArr;
        for (let i = 0; i < 2; i++) {
            tmp[i] = arr1[i] - arr2[i];
        }
        return new Vector2(tmp);
    }

    public static scalarMultiplication(scalar: number, v: Vector2) {
        let tmp: vector2 = Vector2.zeroVector();
        let arr = v.positionArr;
        for (let i = 0; i < 2; i++) {
            tmp[i] = arr[i] * scalar;
        }
        return new Vector2(tmp);
    }

    public static scalarDivision(scalar: number, v: Vector2) {
        if(scalar != 0){
            let tmp: vector2 = Vector2.zeroVector();
            let arr = v.positionArr;
            for (let i = 0; i < 2; i++) {
                tmp[i] = arr[i] / scalar;
            }
            return new Vector2(tmp);
        }
        return new Vector2();
    }

    public static scalarVectorMultiplication(v1: Vector2, v2: Vector2) {
        let tmp: number = 0;
        let arr1 = v1.positionArr;
        let arr2 = v2.positionArr;
        for (let i = 0; i < 2; i++) {
            tmp += arr1[i] * arr2[i];
        }
        return tmp;
    }

    public static normalization(v: Vector2) {
        let tmp: vector2 = Vector2.zeroVector();
        let arr = v.positionArr;
        for (let i = 0; i < 2; i++) {
            tmp[i] = arr[i] / v.length();
        }
        return new Vector2(tmp);
    }

    public static zeroVector(): vector2 {
        return [0, 0];
    }
}