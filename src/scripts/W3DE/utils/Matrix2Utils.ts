import {vector2, Vector2} from "../maths/Vector2";
import {matrix2} from "../maths/Matrix2";

export class Matrix2Utils {
    protected static _dimension = 2;

    public static zeroMatrix(): matrix2 {
        return [[0, 0], [0, 0]];
    }

    public static buildMatrix(value: number): matrix2 {
        let res: matrix2 = Matrix2Utils.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = value;
            }
        }
        return res;
    }

    public static matrixToMatrix2(m: number[][] | matrix2): matrix2 {
        let res = Matrix2Utils.zeroMatrix();
        //console.log(res);
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = m[i] === undefined || m[i][j] === undefined ? 0 : m[i][j];
            }
        }
        return res;
    }

    //TODO сделать лучше?? если можно
    public static identityMatrix() {
        let res = Matrix2Utils.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            res[i][i] = 1;
        }
        return res;
    }

    public static sumArray(a: matrix2, b: matrix2):matrix2 {

        let res = Matrix2Utils.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = (a[i][j] || 0) + (typeof b[i][j] === 'undefined' ? 0 : b[i][j]);
            }
        }
        return res;
    }

    public static vectorMultiplication(m: matrix2, v: vector2):vector2  {
        let res = Vector2.zeroVector();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i] += m[i][j] * v[j];
            }
        }
        return res;
    }

    public static transponse(m: matrix2) {
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < i; j++) {
                let tmp = m[i][j];
                m[i][j] = m[j][i];
                m[j][i] = tmp;
            }
        }
        return m;
    }
}