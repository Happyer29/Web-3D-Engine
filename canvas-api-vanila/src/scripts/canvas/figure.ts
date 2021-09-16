import Color from 'ts-color-class';

interface Position {
    x: number,
    y: number
}

interface PositionObj {
    position: Position
}

export interface Circle extends PositionObj{
    radius: number
}

export interface Rectangle extends PositionObj{
    width: number,
    height: number
}

export interface colorString{
    color: any
}

interface ColorInterface{
    color: Color
}

export type ColorFulCircle = Circle & ColorInterface;
type ColorFulRectangle = Rectangle & ColorInterface;


export class Figure {
    constructor() {
    }

    public createCircle(ctx: CanvasRenderingContext2D, figure: ColorFulCircle) {
        this.prepareCtx(ctx);

        ctx.fillStyle = new Color(figure.color).toString();
        ctx.beginPath();
        ctx.arc(figure.position.x, figure.position.y, 50, 0, Math.PI * 2, true);
        ctx.closePath();
    }

    public createRectangle(ctx: CanvasRenderingContext2D, figure: ColorFulRectangle) {
        this.prepareCtx(ctx);

        ctx.fillStyle = new Color(figure.color).toString();
        ctx.beginPath();
        ctx.moveTo(figure.position.x, figure.position.y);
        ctx.lineTo(figure.position.x, figure.position.y + figure.height);
        ctx.lineTo(figure.width + figure.position.x, figure.position.y + figure.height);
        ctx.lineTo(figure.width + figure.position.x, figure.position.y);
        ctx.closePath();
    }

    public render(ctx: CanvasRenderingContext2D): void{
        ctx.fill();
    }

    private prepareCtx(ctx: CanvasRenderingContext2D){
        ctx.save();
    }

    //instanceOf checks
    protected instanceOfColorFulCircle(obj: any): obj is ColorFulCircle{
        return !!(obj as ColorFulCircle).radius;
    }

    protected instanceOfColorFulRectangle(obj:any): obj is ColorFulRectangle{
        return !!((obj as ColorFulRectangle).width && (obj as ColorFulRectangle).height);
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