import { fixedLengthArray } from "../fixedLengthArray";
export declare type dimension = null | 2 | 3 | 4;
export declare type point = fixedLengthArray<number, dimension>;
export declare class Point {
    protected _point: point;
    private readonly _dimension;
    constructor(p: point);
    get point(): point;
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    get dimension(): dimension;
    static isDimensionEquals(p1: Point, p2: Point, dimension?: dimension): boolean;
}
