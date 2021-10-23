import {colorFulCircle, colorFulFigure, colorFulRectangle, Figure} from "./figure";
import Color from 'ts-color-class';
import {Vector2D} from "./Vector/vector2D";
import {Point} from "./Point/point";
import {Vector} from "./Vector/vectorClass";

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
                let p1 = new Point([el.position.x, el.position.y])
                let p2 = new Point([moveTo.x, moveTo.y]);
                //TODO Vector не принимает в аргументы любые названия точек, надо чтобы они назывались p1, p2 (нужно переделать интерфейс)
                let vector = new Vector2D({p1, p2})

                let unitVector = Vector2D.normalization(vector);
                let posUnitVector = unitVector.positionObj

                let speed = 0.4;
                let deltaPosPerFrame = {
                    x: speed * posUnitVector.x * t,
                    y: speed * posUnitVector.y * t
                }

                let vx = new Vector([el.position.x, deltaPosPerFrame.x]);
                let vMoveToX = new Vector([el.position.x, moveTo.x]);
                let vy = new Vector([el.position.y, deltaPosPerFrame.y]);
                let vMoveToY = new Vector([el.position.y, moveTo.y]);

                console.log(vMoveToX.length())
                //if(Math.abs(el.position.x - moveTo.x) < Number.EPSILON && Math.abs(el.position.y - moveTo.y) < Number.EPSILON ){
                if (Math.abs(vx.length()-vMoveToX.length()) < Number.EPSILON && Math.abs(vy.length()-vMoveToY.length()) < Number.EPSILON){
                    el.setPosition({x: moveTo.x, y:moveTo.y})
                    el.moveTo({x: null, y:null})
                }
                else{
                    el.position.x += deltaPosPerFrame.x;
                    el.position.y += deltaPosPerFrame.y;
                }

                if(el.type == "rectangle"){
                    //console.log(el.position)
                }
            }
            this.drawFigure(ctx, el);
        })
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