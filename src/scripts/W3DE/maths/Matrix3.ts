import {fixedLengthArray} from "../utils/fixedLengthArray";
import {Vector3} from "./Vector3";

type matrix3 = fixedLengthArray<fixedLengthArray<number, 3>, 3> // equal to [[0,0,0], [0,0,0], [0,0,0]]
//TODO ЧТО МЫ ВОЗВРАЩАЕМ ОТ СТАТИЧЕСКИХ МЕТОДОВ? ЭКЗЕМПЛЯР КЛАССА ИЛИ МАССИВ ЗНАЧЕНИЙ?
export class Matrix3 {
    private _matrix: matrix3;
    private static readonly _dimension: number = 3;

    constructor(m: number[][] | matrix3) {
        this._matrix = Matrix3.matrixToMatrix3(m);
    }

    get matrix() {
        return this._matrix;
    }

    public setMatrix(m:number[][] | matrix3) {
        this._matrix = Matrix3.matrixToMatrix3(m);
    }

    get dimension() {
        return Matrix3._dimension;
    }

    public static zeroMatrix(): matrix3 {
        return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }

    private static buildMatrix(value: number): matrix3 {
        let res: matrix3 = Matrix3.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = value;
            }
        }
        return res;
    }

    public static matrixToMatrix3(m: number[][] | matrix3): matrix3 {
        let res = Matrix3.zeroMatrix();
        //console.log(res);
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = m[i] === undefined || m[i][j] === undefined  ? 0 : m[i][j];
            }
        }
        return res;
    }

    //TODO сделать лучше?? если можно
    public static identityMatrix() {
        let res = Matrix3.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            res[i][i] = 1;
        }
        return res;
    }

    public static sumArray(a: Matrix3, b: Matrix3) {
        let m1 = a.matrix;
        let m2 = b.matrix;

        let res = Matrix3.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = (m1[i][j] || 0) + (typeof m2[i][j] === 'undefined' ? 0 : m2[i][j]);
            }
        }
        return res;
    }

    public static vectorMultiplication(m: Matrix3, v: Vector3) {
        let vPos = v.positionArr;

        let res = Vector3.zeroVector();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i] += m._matrix[i][j] * vPos[j];
            }
        }
        return res;
    }

    public static transponse(m: Matrix3) {
        let arr = m._matrix;
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < i; j++) {
                let tmp = arr[i][j];
                arr[i][j] = arr[j][i];
                arr[j][i] = tmp;
            }
        }
        return new Matrix3(arr);
    }
}