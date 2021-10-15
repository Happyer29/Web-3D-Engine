import {colorFulFigure, Figure, Position} from "./figure";

interface figureBase {
    figure: colorFulFigure,
    animateTo: Position
}

export class FigureController extends Figure {
    private figureObj = [];

    protected addFigure(ctx, figure: colorFulFigure) {
        let tmp = {figure: figure};
        this.figureObj.push(tmp);
        super.drawFigure(ctx, figure);
    }

    protected getFigures() {
        return this.figureObj;
    }

    protected getFiguresArray(): Array<colorFulFigure> {
        let tmp = []
        this.figureObj.forEach(el => tmp.push(el.figure))
        return tmp;
    }

    protected deleteFigure(key: number) {
        this.figureObj.splice(key, 1);
    }

    protected drawAllFigures(ctx: CanvasRenderingContext2D) {
        this.figureObj.forEach((el) => {
            super.drawFigure(ctx, el.figure);
        })
    }
}