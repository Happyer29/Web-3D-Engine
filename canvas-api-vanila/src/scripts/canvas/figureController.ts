import {colorFulCircle, colorFulFigure, colorFulRectangle, Figure, Vector} from "./figure";
import Color from 'ts-color-class';

export class FigureController {
    private figures:Array<Figure> = [];

    protected addFigure(ctx, figure: Figure) {
        this.figures.push(figure);
        //this.drawFigure(ctx, figure);
    }

    protected getFigures() {
        return this.figures;
    }

    protected deleteFigure(key: number) {
        this.figures.splice(key, 1);
    }

    protected drawAllFigures(ctx: CanvasRenderingContext2D, t:number) {
        this.figures.forEach((el) => {
            let moveTo = el.getMoveTo;
            if(moveTo.x != null && moveTo.y != null) {
                let vector: Vector = {
                    x: moveTo.x - el.position.x,
                    y: moveTo.y - el.position.y,
                }

                let unitVector = this.unitVector(vector);
                el.position.x += 0.02 * unitVector.x * t;
                el.position.y += 0.02 * unitVector.y * t;
                if (Math.abs(el.position.x-moveTo.x) < unitVector.x && Math.abs(el.position.y-moveTo.y) < unitVector.y){
                    el.moveTo({x: null, y:null})
                    el.setPosition({x: el.position.x, y:el.position.y})
                }
                    console.log(el.position)
            }
            this.drawFigure(ctx, el);
        })
    }

    protected vectorLengthDots(startPos: Vector, endPos:Vector) {
        return Math.sqrt(Math.pow(startPos.x - endPos.x,2) + Math.pow(startPos.y - endPos.y,2))
    }

    protected vectorLength(vector: Vector):number{
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
    }

    protected unitVector(vector:Vector){
        console.log(vector);
        console.log(this.vectorLength(vector))
        return {
            x: vector.x/this.vectorLength(vector),
            y: vector.y/this.vectorLength(vector)
        };
    }

    private drawFigure(ctx: CanvasRenderingContext2D, figure: Figure) {
        if (figure.type == "rectangle") {
            this.drawRectangle(ctx, (figure.info as colorFulRectangle))
        } else if (figure.type == "circle") {
            this.drawCircle(ctx, (figure.info as colorFulCircle))
        }
    }


    private drawCircle<T>(ctx: CanvasRenderingContext2D, figure: colorFulCircle) {
        this.prepareCtx(ctx);

        ctx.fillStyle = new Color(figure.color).toString();
        ctx.beginPath();
        ctx.arc(figure.position.x, figure.position.y, figure.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, figure: colorFulRectangle) {
        this.prepareCtx(ctx);

        ctx.fillStyle = new Color(figure.color).toString();
        ctx.beginPath();
        ctx.moveTo(figure.position.x, figure.position.y);
        ctx.lineTo(figure.position.x, figure.position.y + figure.height);
        ctx.lineTo(figure.width + figure.position.x, figure.position.y + figure.height);
        ctx.lineTo(figure.width + figure.position.x, figure.position.y);
        ctx.closePath();
        ctx.fill();
    }

    private prepareCtx(ctx: CanvasRenderingContext2D) {
        ctx.save();
    }
}