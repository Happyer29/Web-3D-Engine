import {fixedLengthArray} from "../utils/fixedLengthArray";
import {Vector3} from "./Vector3";
import {Matrix3Utils} from "../utils/Matrix3Utils";

export type matrix3 = fixedLengthArray<fixedLengthArray<number, 3>, 3> // equal to [[0,0,0], [0,0,0], [0,0,0]]
export class Matrix3 {
    private _matrix: matrix3;
    private readonly _dimension: number = 3;

    constructor(m: number[][] | matrix3) {
        this._matrix = Matrix3Utils.matrixToMatrix3(m);
    }

    get matrix() {
        return this._matrix;
    }

    public setMatrix(m:number[][] | matrix3) {
        this._matrix = Matrix3Utils.matrixToMatrix3(m);
        return this;
    }

    get dimension() {
        return this._dimension;
    }


    public zeroMatrix(){
        return Matrix3Utils.zeroMatrix();
    }

    public matrixToMatrix3(){
        this._matrix = Matrix3Utils.matrixToMatrix3(this._matrix);
        return this;
    }

    public identityMatrix() {
        this._matrix = Matrix3Utils.identityMatrix();
        return this;
    }

    public sumArray(a: Matrix3) {
        this._matrix = Matrix3Utils.sumArray(this._matrix, a._matrix);
        return this;
    }

    public transponse() {
        this._matrix = Matrix3Utils.transponse(this._matrix);
        return this;
    }
}