import { Vector4 } from "../maths/Vector4";
import { matrix4, Matrix4 } from "../maths/Matrix4";
import { MathGPU } from "./MathGPU";
import { GPU } from "gpu.js";
import { matrix3 } from "../maths/Matrix3";

const gpu = new GPU({ mode: "cpu" });
function miltiplic(a: number[][], b: number[][]) {
    let sum = 0;
    for (let i = 0; i < 4; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
}
const kernelMult = gpu.createKernel(miltiplic).setOutput([4, 4]);

export class Matrix4Utils {
    protected static _dimension = 4;



    public static identityMatrix() {
        let res = Matrix4.zeroMatrix();
        for (let i = 0; i < Matrix4Utils._dimension; i++) {
            res[i][i] = 1;
        }
        return res;
    }

    public static sumArray(a: Matrix4, b: Matrix4) {
        let m1 = a.matrix;
        let m2 = b.matrix;

        let res = Matrix4.zeroMatrix();
        for (let i = 0; i < Matrix4Utils._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = (m1[i][j] || 0) + (typeof m2[i][j] === 'undefined' ? 0 : m2[i][j]);
            }
        }
        return res;
    }

    public static vectorMultiplication(m: Matrix4, v: Vector4) {
        let vPos = v.positionArr;

        let res = Vector4.zeroVector();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i] += m.matrix[i][j] * vPos[j];
            }
        }
        return res;
    }

    public static multiplication(a: matrix4, b: matrix4) {
        const ae = Matrix4Utils.to2Array(a);
        const be = Matrix4Utils.to2Array(b);
        const mult = kernelMult(ae, be);
        const tmp: matrix4 = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                tmp[i][j] = mult[i][j];
            }
        }
        return tmp;
    }

    public static to2Array(matrix: matrix4) {
        let tmp: number[][] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        for (let i = 0; i < Matrix4Utils._dimension; i++) {
            for (let j = 0; j < Matrix4Utils._dimension; j++) {
                tmp[i][j] = matrix[i][j];
            }
        }
        return tmp;
    }

    public static transponse(m: matrix4) {
        const te = m;
        let tmp;

        tmp = te[0][1];
        te[0][1] = te[1][0];
        te[1][0] = tmp;
        tmp = te[0][2];
        te[0][2] = te[2][0];
        te[2][0] = tmp;
        tmp = te[1][2];
        te[1][2] = te[2][1];
        te[2][1] = tmp;
        tmp = te[0][3];
        te[0][3] = te[3][0];
        te[3][0] = tmp;
        tmp = te[1][3];
        te[1][3] = te[3][1];
        te[3][1] = tmp;
        tmp = te[2][3];
        te[2][3] = te[3][2];
        te[3][2] = tmp;

        return te;
    }

    public static translation(tx: number, ty: number, tz: number): matrix4 {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [tx, ty, tz, 1]
        ];
    }

    //TODO radians
    public static xRotation(angleInRadians): matrix4 {
        const c = MathGPU.cos(angleInRadians);
        const s = MathGPU.sin(angleInRadians);

        return [
            [1, 0, 0, 0],
            [0, c, s, 0],
            [0, -s, c, 0],
            [0, 0, 0, 1]
        ];
    }

    public static yRotation(angleInRadians): matrix4 {
        const c = MathGPU.cos(angleInRadians);
        const s = MathGPU.sin(angleInRadians);

        return [
            [c, 0, -s, 0],
            [0, 1, 0, 0],
            [s, 0, c, 0],
            [0, 0, 0, 1]
        ];
    }

    public static zRotation(angleInRadians): matrix4 {
        const c = MathGPU.cos(angleInRadians);
        const s = MathGPU.sin(angleInRadians);

        return [
            [c, s, 0, 0],
            [-s, c, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    public static scaling(sx: number, sy: number, sz: number): matrix4 {
        return [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];
    }

    public static translate(m: matrix4, tx: number, ty: number, tz: number): matrix4 {
        return Matrix4Utils.multiplication(m, Matrix4Utils.translation(tx, ty, tz));
    }

    public static xRotate(m: matrix4, angle) {
        let inRadians = angle * Math.PI / 180;
        return Matrix4Utils.multiplication(m, Matrix4Utils.xRotation(inRadians));
    }

    public static yRotate(m: matrix4, angle) {
        let inRadians = angle * Math.PI / 180;
        return Matrix4Utils.multiplication(m, Matrix4Utils.yRotation(inRadians));
    }

    public static zRotate(m: matrix4, angle) {
        let inRadians = angle * Math.PI / 180;
        return Matrix4Utils.multiplication(m, Matrix4Utils.zRotation(inRadians));
    }

    public static scale(m: matrix4, sx: number, sy: number, sz: number) {
        return Matrix4Utils.multiplication(m, Matrix4Utils.scaling(sx, sy, sz));
    }

    public static projection(width: number, height: number, depth: number): matrix4 {
        return [
            [2 / width, 0, 0, 0],
            [0, -2 / height, 0, 0],
            [0, 0, 2 / depth, 0],
            [-1, 1, 0, 1],
        ];
    }
}