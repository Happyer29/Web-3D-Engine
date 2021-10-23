import { dimension } from "./Point/point";
import { Vector } from "./Vector/vectorClass";
declare type matrix = number[][];
export declare class Matrix {
    private _matrix;
    private _dimension;
    constructor(m: matrix, d: dimension);
    get matrix(): matrix;
    get dimension(): dimension;
    static zeroMatrix(d: dimension): number[][];
    static identityMatrix(d: dimension): number[][];
    private static buildMatrix;
    static sumArray(a: Matrix, b: Matrix): number[][];
    static vectorMultiplication(m: Matrix, v: Vector): number[];
    static transponse(m: Matrix): Matrix;
}
export {};
