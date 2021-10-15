import { colorFulFigure, figure } from "./figure";
import { FigureController } from "./figureController";
export declare class Canvas extends FigureController {
    private readonly _canvas;
    private _ctx;
    private readonly _canvasWidth;
    private readonly _canvasHeight;
    private _fps;
    constructor(selector: string);
    get ctx(): CanvasRenderingContext2D;
    addFigure(figure: colorFulFigure): void;
    getFigures(): Array<figure>;
    render(): void;
    get frameDelay(): number;
    private clear;
}
