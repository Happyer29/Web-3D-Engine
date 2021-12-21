import {fixedLengthArray} from "../utils/fixedLengthArray";
import {Vector4} from "./Vector4";
import {Matrix4Utils} from "../utils/Matrix4Utils";

export type matrix4 = fixedLengthArray<fixedLengthArray<number, 4>, 4> // equal to [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
//TODO ЧТО МЫ ВОЗВРАЩАЕМ ОТ СТАТИЧЕСКИХ МЕТОДОВ? ЭКЗЕМПЛЯР КЛАССА ИЛИ МАССИВ ЗНАЧЕНИЙ?
export class Matrix4 {
    private _matrix: matrix4;
    private static readonly _dimension: number = 4;

    constructor(m?: number[][] | matrix4) {
        this._matrix = Matrix4.matrixToMatrix4(m ?? []);
    }

    get matrix(): matrix4 {
        return this._matrix;
    }

    public setMatrix(m: number[][] | matrix4) {
        this._matrix = Matrix4.matrixToMatrix4(m);
    }

    get dimension() {
        return Matrix4._dimension;
    }

    public static zeroMatrix(): matrix4 {
        return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    }

    private static buildMatrix(value: number): matrix4 {
        let res: matrix4 = Matrix4.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = value;
            }
        }
        return res;
    }

    public static matrixToMatrix4(m: number[][] | matrix4): matrix4 {
        let res = Matrix4.zeroMatrix();
        for (let i = 0; i < this._dimension; i++) {
            for (let j = 0; j < this._dimension; j++) {
                res[i][j] = m[i] === undefined || m[i][j] === undefined ? 0 : m[i][j];
            }
        }
        return res;
    }

    public matrixToArray(){
        let tmp:number[] = []
        for (let i = 0; i < Matrix4._dimension; i++) {
            for (let j = 0; j < Matrix4._dimension; j++) {
                tmp.push(this._matrix[i][j]);
            }
        }
        return tmp;
    }


    //MATRIXUTILS
    public identityMatrix(){
        this._matrix = Matrix4Utils.identityMatrix();
        return this;
    }

    public translate(tx: number, ty: number, tz: number){
        this._matrix = Matrix4Utils.translate(this._matrix, tx, ty, tz);
        return this;
    }

    public xRotation(angleInRadians : number){
        this._matrix = Matrix4Utils.xRotation(angleInRadians);
        return this;
    }

    public yRotation(angleInRadians : number){
        this._matrix = Matrix4Utils.yRotation(angleInRadians);
        return this;
    }

    public zRotation(angleInRadians : number){
        this._matrix = Matrix4Utils.zRotation(angleInRadians);
        return this;
    }

    public scaling(sx: number, sy: number, sz: number){
        this._matrix = Matrix4Utils.scaling(sx, sy, sz);
        return this;
    }

    public xRotate(angleInRadians : number){
        this._matrix = Matrix4Utils.xRotate(this._matrix, angleInRadians);
        return this;
    }

    public yRotate(angleInRadians : number){
        this._matrix = Matrix4Utils.yRotate(this._matrix, angleInRadians);
        return this;
    }

    public zRotate(angleInRadians : number){
        this._matrix = Matrix4Utils.zRotate(this._matrix, angleInRadians);
        return this;
    }

    public scale(sx: number, sy: number, sz: number) {
        this._matrix = Matrix4Utils.scale(this._matrix, sx, sy, sz);
        return this;
    }

    public projection(width: number, height: number, depth: number){
        this._matrix = Matrix4Utils.projection(width, height, depth);
        return this;
    }

    public inverse() {
        this._matrix = Matrix4Utils.inverse(this._matrix);
        return this;
    }

}