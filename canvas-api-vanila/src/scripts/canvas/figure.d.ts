import Color from 'ts-color-class';
interface Position {
    x: number;
    y: number;
}
interface PositionObj {
    position: Position;
}
export interface Circle extends PositionObj {
    radius: number;
}
export interface Rectangle extends PositionObj {
    width: number;
    height: number;
}
export interface colorString {
    color: any;
}
interface ColorInterface {
    color: Color;
}
export declare type ColorFulCircle = Circle & ColorInterface;
declare type ColorFulRectangle = Rectangle & ColorInterface;
export declare class Figure {
    constructor();
    createCircle(ctx: CanvasRenderingContext2D, figure: ColorFulCircle): void;
    createRectangle(ctx: CanvasRenderingContext2D, figure: ColorFulRectangle): void;
    render(ctx: CanvasRenderingContext2D): void;
    private prepareCtx;
    protected instanceOfColorFulCircle(obj: any): obj is ColorFulCircle;
    protected instanceOfColorFulRectangle(obj: any): obj is ColorFulRectangle;
}
export {};
