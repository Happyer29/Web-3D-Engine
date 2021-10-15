import Color from 'ts-color-class';
export interface Position {
    x: number;
    y: number;
}
interface Circle {
    type: "circle";
    radius: number;
    position: Position;
}
export interface Rectangle {
    type: "rectangle";
    width: number;
    height: number;
    position: Position;
}
export interface colorString {
    color: any;
}
interface ColorInterface {
    color: Color;
}
export declare type figure = Circle | Rectangle;
export declare type colorFulFigure = figure & ColorInterface;
declare type colorFulCircle = Circle & ColorInterface;
declare type colorFulRectangle = Rectangle & ColorInterface;
export declare class Figure {
    drawFigure(ctx: CanvasRenderingContext2D, figure: colorFulFigure): void;
    private drawCircle;
    private drawRectangle;
    private prepareCtx;
    protected instanceOfColorFulCircle(obj: colorFulFigure): obj is colorFulCircle;
    protected instanceOfColorFulRectangle(obj: colorFulFigure): obj is colorFulRectangle;
}
export {};
