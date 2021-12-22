import {vector3, Vector3} from "../maths/Vector3";
import {matrix3} from "../maths/Matrix3";

export class Matrix3Utils {
    protected static _dimension = 3;

    public static zeroMatrix(): matrix3 {
        return [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }

    public static buildMatrix(value: number): matrix3 {
        let res: matrix3 = Matrix3Utils.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = value;
            }
        }
        return res;
    }

    public static matrixToMatrix3(m: number[][] | matrix3): matrix3 {
        let res = Matrix3Utils.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = m[i] === undefined || m[i][j] === undefined ? 0 : m[i][j];
            }
        }
        return res;
    }

    //TODO сделать лучше?? если можно
    public static identityMatrix() {
        let res = Matrix3Utils.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            res[i][i] = 1;
        }
        return res;
    }

    public static sumArray(a: matrix3, b: matrix3):matrix3 {

        let res = Matrix3Utils.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = (a[i][j] || 0) + (typeof b[i][j] === 'undefined' ? 0 : b[i][j]);
            }
        }
        return res;
    }

    public static vectorMultiplication(m: matrix3, v: vector3):vector3  {
        let res = Vector3.zeroVector();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i] += m[i][j] * v[j];
            }
        }
        return res;
    }

    public static transponse(m: matrix3) {
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