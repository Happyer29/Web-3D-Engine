import Color from 'ts-color-class';

export interface Position {
    x: number,
    y: number
}

interface Circle{
    type: "circle",
    radius: number,
    position: Position,
}

export interface Rectangle{
    type: "rectangle",
    width: number,
    height: number,
    position: Position
}

export interface colorString{
    color: any
}

interface ColorInterface{
    color: Color
}

// export type ColorFulCircle = Circle & ColorInterface;
// type ColorFulRectangle = Rectangle & ColorInterface;
export type figure = Circle | Rectangle;
export type colorFulFigure = figure & ColorInterface;

type colorFulCircle = Circle & ColorInterface;
type colorFulRectangle = Rectangle & ColorInterface;


export class Figure {

    public drawFigure(ctx: CanvasRenderingContext2D, figure: colorFulFigure){
        if(this.instanceOfColorFulRectangle(figure)){
            this.drawRectangle(ctx, (figure as colorFulRectangle))
        }
        else if(this.instanceOfColorFulCircle(figure)){
            this.drawCircle(ctx, (figure as colorFulCircle))
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

    private prepareCtx(ctx: CanvasRenderingContext2D){
        //ctx.save();
    }

    //instanceOf checks
    protected instanceOfColorFulCircle(obj: colorFulFigure): obj is colorFulCircle{
        return !!(obj as colorFulCircle).radius;
    }

    protected instanceOfColorFulRectangle(obj:colorFulFigure): obj is colorFulRectangle{
        return !!((obj as colorFulRectangle).width && (obj as colorFulRectangle).height);
    }



    /*    constructor(ctx: CanvasRenderingContext2D, figure:ColorFulCircle | ColorFulRectangle){

        ctx.save();
        ctx.fillStyle = new Color(figure.color).toString();

        if (this.instanceOfColorFulCircle(figure)) {
            this.createCircle(ctx, figure);
        }
        else if (this.instanceOfColorFulRectangle(figure)) {
            //ctx.rect(figure.position.x, figure.position.y, figure.width, figure.height);
            this.createRectangle(ctx, figure);
        }
    }*/
}