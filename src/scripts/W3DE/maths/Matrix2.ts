import {fixedLengthArray} from "../utils/fixedLengthArray";
import {Matrix2Utils} from "../utils/Matrix2Utils";

export type matrix2 = fixedLengthArray<fixedLengthArray<number, 2>, 2> // equal to [[0,0], [0,0]]
export class Matrix2 {
    private _matrix: matrix2;
    private readonly _dimension: number = 2;

    constructor(m: number[][] | matrix2) {
        this._matrix = Matrix2Utils.matrixToMatrix2(m);
    }

    get matrix() {
        return this._matrix;
    }

    public setMatrix(m:number[][] | matrix2) {
        this._matrix = Matrix2Utils.matrixToMatrix2(m);
        return this;
    }

    get dimension() {
        return this._dimension;
    }


    public zeroMatrix(){
        return Matrix2Utils.zeroMatrix();
    }

    public matrixToMatrix2(){
        this._matrix = Matrix2Utils.matrixToMatrix2(this._matrix);
        return this;
    }

    public identityMatrix() {
        this._matrix = Matrix2Utils.identityMatrix();
        return this;
    }

    public sumArray(a: Matrix2) {
        this._matrix = Matrix2Utils.sumArray(this._matrix, a._matrix);
        return this;
    }

    public transponse() {
        this._matrix = Matrix2Utils.transponse(this._matrix);
        return this;
    }
}