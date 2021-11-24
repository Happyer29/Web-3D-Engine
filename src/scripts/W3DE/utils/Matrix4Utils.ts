import {Vector4} from "../maths/Vector4";
import {matrix4, Matrix4} from "../maths/Matrix4";

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

    public static multiplication(a: matrix4, b: matrix4){
        const ae = a;
        const be = b;
        const te = Matrix4.zeroMatrix();

        //TODO в three сделано одномерным массивом (у них двумерных массивов нет)
        const a11 = ae[0][0], a12 = ae[1][0], a13 = ae[2][0], a14 = ae[3][0];
        const a21 = ae[0][1], a22 = ae[1][1], a23 = ae[2][1], a24 = ae[3][1];
        const a31 = ae[0][2], a32 = ae[1][2], a33 = ae[2][2], a34 = ae[3][2];
        const a41 = ae[0][3], a42 = ae[1][3], a43 = ae[2][3], a44 = ae[3][3];

        const b11 = be[0][0], b12 = be[1][0], b13 = be[2][0], b14 = be[3][0];
        const b21 = be[0][1], b22 = be[1][1], b23 = be[2][1], b24 = be[3][1];
        const b31 = be[0][2], b32 = be[1][2], b33 = be[2][2], b34 = be[3][2];
        const b41 = be[0][3], b42 = be[1][3], b43 = be[2][3], b44 = be[3][3];

        te[0][0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[1][0] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[2][0] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[3][0] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[0][1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[1][1] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[2][1] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[3][1] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[0][2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[1][2] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[2][2] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[3][2] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[0][3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[1][3] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[2][3] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[3][3] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return te;
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
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
        return [
            [1, 0, 0, 0],
            [0, c, s, 0],
            [0, -s, c, 0],
            [0, 0, 0, 1]
        ];
    }

    //TODO посчитать один раз синусы косинусы
    public static yRotation(angleInRadians): matrix4 {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return [
            [c, 0, -s, 0],
            [0, 1, 0, 0],
            [s, 0, c, 0],
            [0, 0, 0, 1]
        ];
    }

    public static zRotation(angleInRadians): matrix4 {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

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

    public static translate(m: matrix4, tx: number, ty: number, tz: number): matrix4{
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