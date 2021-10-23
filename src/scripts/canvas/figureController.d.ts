import { Figure } from "./figure";
export declare class FigureController {
    private figures;
    protected addFigure(ctx: any, figure: Figure): void;
    protected getFigures(): Figure[];
    protected deleteFigure(key: number): void;
    protected drawAllFigures(ctx: CanvasRenderingContext2D, t: number): void;
    private drawFigure;
    private drawCircle;
    private drawRectangle;
    private prepareCtx;
}
