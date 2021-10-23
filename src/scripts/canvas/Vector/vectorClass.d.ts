import { dimension, Point } from "../Point/point";
import { fixedLengthArray } from "../fixedLengthArray";
interface VectorPoints {
    p1: Point;
    p2: Point;
}
interface VectorObj {
    x: number;
    y: number;
    z?: number;
    w?: number;
}
export declare type vector = fixedLengthArray<number, dimension> | VectorPoints;
export declare class Vector {
    protected _vector: vector;
    protected readonly _dimension: dimension;
    constructor(v: vector);
    private betweenPoints;
    length(): number;
    get positionObj(): VectorObj;
    get positionArr(): vector;
    static sum(v1: Vector, v2: Vector): Vector;
    static minus(v1: Vector, v2: Vector): Vector;
    static scalarMultiplication(scalar: number, v: Vector): Vector;
    static scalarDivision(scalar: number, v: Vector): Vector;
    static scalarVectorMultiplication(v1: Vector, v2: Vector): number;
    static normalization(v: Vector): Vector;
    static zeroVector(d: dimension): number[];
    get dimension(): dimension;
    protected static isDimensionEquals(v1: Vector, v2: Vector): boolean;
    private static instanceOfVectorPoints;
}
export {};
