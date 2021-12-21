import { Vector4 } from "../maths/Vector4";
import { matrix4, Matrix4 } from "../maths/Matrix4";
import { matrix3 } from "../maths/Matrix3";
import { Vector3 } from "../W3DE";

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
        let tmp: number;

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
    public static xRotation(angleInRadians: number): matrix4 {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            [1, 0, 0, 0],
            [0, c, s, 0],
            [0, -s, c, 0],
            [0, 0, 0, 1]
        ];
    }

    public static yRotation(angleInRadians: number): matrix4 {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            [c, 0, -s, 0],
            [0, 1, 0, 0],
            [s, 0, c, 0],
            [0, 0, 0, 1]
        ];
    }

    public static zRotation(angleInRadians: number): matrix4 {
        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

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

    public static xRotate(m: matrix4, angle: number) {
        let inRadians = angle * Math.PI / 180;
        return Matrix4Utils.multiplication(m, Matrix4Utils.xRotation(inRadians));
    }

    public static yRotate(m: matrix4, angle: number) {
        let inRadians = angle * Math.PI / 180;
        return Matrix4Utils.multiplication(m, Matrix4Utils.yRotation(inRadians));
    }

    public static zRotate(m: matrix4, angle: number) {
        let inRadians = angle * Math.PI / 180;
        return Matrix4Utils.multiplication(m, Matrix4Utils.zRotation(inRadians));
    }

    public static scale(m: matrix4, sx: number, sy: number, sz: number) {
        return Matrix4Utils.multiplication(m, Matrix4Utils.scaling(sx, sy, sz));
    }

    public static inverse(m: matrix4) : matrix4 {
        let m00 = m[0][0];
        let m01 = m[0][1];
        let m02 = m[0][2];
        let m03 = m[0][3];
        let m10 = m[1][0];
        let m11 = m[1][1];
        let m12 = m[1][2];
        let m13 = m[1][3];
        let m20 = m[2][0];
        let m21 = m[2][1];
        let m22 = m[2][2];
        let m23 = m[2][3];
        let m30 = m[3][0];
        let m31 = m[3][1];
        let m32 = m[3][2];
        let m33 = m[3][3];
        let tmp_0 = m22 * m33;
        let tmp_1 = m32 * m23;
        let tmp_2 = m12 * m33;
        let tmp_3 = m32 * m13;
        let tmp_4 = m12 * m23;
        let tmp_5 = m22 * m13;
        let tmp_6 = m02 * m33;
        let tmp_7 = m32 * m03;
        let tmp_8 = m02 * m23;
        let tmp_9 = m22 * m03;
        let tmp_10 = m02 * m13;
        let tmp_11 = m12 * m03;
        let tmp_12 = m20 * m31;
        let tmp_13 = m30 * m21;
        let tmp_14 = m10 * m31;
        let tmp_15 = m30 * m11;
        let tmp_16 = m10 * m21;
        let tmp_17 = m20 * m11;
        let tmp_18 = m00 * m31;
        let tmp_19 = m30 * m01;
        let tmp_20 = m00 * m21;
        let tmp_21 = m20 * m01;
        let tmp_22 = m00 * m11;
        let tmp_23 = m10 * m01;

        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
        
        
        return [
            [d * t0, d * t1, d * t2, d * t3],
            [d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
             d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
             d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
             d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20))],
            [d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
             d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
             d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
             d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23))],
            [d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
             d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
             d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
             d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))]
        ]

    }

    public static projection(width: number, height: number, depth: number): matrix4 {
        return [
            [2 / width, 0, 0, 0],
            [0, -2 / height, 0, 0],
            [0, 0, 2 / depth, 0],
            [-1, 1, 0, 1],
        ];
    }

    public static lookAt(cameraPosition: Vector3, target: Vector3, up: Vector3): matrix4 {
        let zAxis = Vector3.normalization(Vector3.minus(cameraPosition, target));
        let xAxis = Vector3.normalization(Vector3.cross(up, zAxis));
        let yAxis = Vector3.normalization(Vector3.cross(zAxis, xAxis));
        
        let zAxisArr = zAxis.positionArr;
        let xAxisArr = xAxis.positionArr;
        let yAxisArr = yAxis.positionArr;
        
        let cameraPositionArr = cameraPosition.positionArr;

        console.log(xAxisArr, yAxisArr, zAxisArr, cameraPositionArr);
        return [
            [xAxisArr[0], xAxisArr[1], xAxisArr[2], 0],
            [yAxisArr[0], yAxisArr[1], yAxisArr[2], 0],
            [zAxisArr[0], zAxisArr[1], zAxisArr[2], 0],
            [cameraPositionArr[0], cameraPositionArr[1], cameraPositionArr[2], 1]
        ]

    }

    public static perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        let rangeInv = 1.0 / (near - far);

        return [
            [f / aspect, 0, 0, 0],
            [0, f, 0 ,0],
            [0, 0, (near + far) * rangeInv, -1],
            [0, 0, near * far * rangeInv * 2, 0]
        ]
    }
}