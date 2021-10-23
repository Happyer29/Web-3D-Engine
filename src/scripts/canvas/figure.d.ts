import Color from 'ts-color-class';
export interface Vector {
    x: number;
    y: number;
}
interface Circle {
    type: "circle";
    radius: number;
    position: Vector;
}
export interface Rectangle {
    type: "rectangle";
    width: number;
    height: number;
    position: Vector;
}
export interface colorString {
    color: any;
}
interface ColorInterface {
    color: Color;
}
declare type figure = Circle | Rectangle;
export declare type colorFulFigure = figure & ColorInterface;
export declare type colorFulCircle = Circle & ColorInterface;
export declare type colorFulRectangle = Rectangle & ColorInterface;
export declare class Figure {
    private readonly _info;
    private _moveTo;
    constructor(figure: colorFulFigure);
    get type(): "circle" | "rectangle";
    get info(): colorFulFigure;
    get position(): Vector;
    setPosition(position: Vector): void;
    set color(color: string);
    get color(): string;
    get getMoveTo(): Vector;
    moveTo(position: Vector): void;
}
export {};
