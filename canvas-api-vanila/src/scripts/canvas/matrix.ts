import {fixedLengthArray} from "./fixedLengthArray";
import {dimension} from "./Point/point";
import {Vector} from "./Vector/vectorClass";

//type matrix = fixedLengthArray<number, dimension>;
type matrix = number[][]
export class Matrix {
    private _matrix: matrix;
    private _dimension: dimension
    constructor(m: matrix, d: dimension){
        if(m.length != d || m[0].length != d){
            let c = Matrix.zeroMatrix(d);
            for (let i = 0; i < m.length; i++) {
                for (let j = 0; j < m[i].length; j++) {
                    console.log()
                    c[i][j] = m[i][j];
                }
            }
            this._matrix = c;
        }
        else{
            this._matrix = m;
        }
        this._dimension = d;
    }

    get matrix(){
        return this._matrix;
    }

    get dimension(){
        return this._dimension;
    }


    public static zeroMatrix(d:dimension){
        return Matrix.buildMatrix(d, 0);
    }

    //TODO сделать лучше
    public static identityMatrix(d:dimension){
        let arr = Matrix.zeroMatrix(d);
        for (let i = 0; i < d; i++) {
            arr[i][i] = 1;
        }
        return arr;
    }

    private static buildMatrix(d:dimension, value: number) {
        return Array.from({ length: d }, _ => Array.from({ length: d }, _ => value));
    }

    public static sumArray(a: Matrix, b: Matrix) {
        let m1 = a.matrix;
        let m2 = b.matrix;

        //TODO поправить as unknown
        let dimension: dimension = Math.max(a.dimension, b.dimension) as unknown as dimension
        let c = Matrix.zeroMatrix(dimension);
        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                c[i][j] = (m1[i][j] || 0) + (typeof m2[i][j] === 'undefined' ? 0 : m2[i][j]);
            }
        }
        return c;
    }

    public static vectorMultiplication(m:Matrix, v:Vector){
        let dimension = null;
        if(m.dimension == v.dimension)
            dimension = m.dimension;
        else
            throw new Error("dimension error")

        let vPos = v.positionArr;

        //TODO zero вектор и подставить сюда
        var c = Vector.zeroVector(dimension);
        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                c[i] += m._matrix[i][j] * vPos[j];
            }
        }
        return c;
    }

    public static transponse(m: Matrix){
        let arr = m._matrix;
        var result = Array.from({ length: arr.reduce(function(max, item) { return item.length > max ? item.length : max; }, 0) }, function(x, row) {
            return Array.from({ length: arr.length }, function(x, col) {
                return arr[col][row];
            });
        });

        //t[0].map((col, c) => t.map((row, r) => t[r][c]));
        return new Matrix(result, m.dimension);
    }
}