import Color from 'ts-color-class';

interface Position {
    x: number,
    y: number
}

interface Circle{
    radius: number
}

interface Rectangle{
    width: number,
    height: number
}

interface Square {
    size: number
}

interface ColorInterface {
    color: Color
}

type ColorFulCircle = Circle & ColorInterface;
type ColorFulRectangle = Rectangle & ColorInterface;
type ColorFulSquare = Square & ColorInterface;


export class Figure {
    private canvas: HTMLCanvasElement;

    constructor(selector: string) {
        this.canvas = <HTMLCanvasElement> document.querySelector(selector);
    }

    public createFigure(figure:ColorFulCircle | ColorFulRectangle | ColorFulSquare, position: Position){
        let ctx:CanvasRenderingContext2D = this.canvas.getContext('2d')
        ctx.save();
        ctx.fillStyle = new Color(figure.color).toString();

        if (this.instanceOfColorFulCircle(figure)) {
            ctx.beginPath();
            ctx.arc(position.x, position.y, 50, 0, Math.PI * 2, true);
        }
        else if (this.instanceOfColorFulRectangle(figure)) {
            ctx.fillRect(position.x, position.y, figure.width, figure.height);
        }
        else if (this.instanceOfColorFulSquare(figure)) {
            ctx.fillRect(position.x, position.y, figure.size, figure.size);
        }

        return ctx;
    }

    public render(ctx:CanvasRenderingContext2D): void{
        ctx.fill();
    }


    //instanceOf checks
    public instanceOfColorFulCircle(obj: any): obj is ColorFulCircle{
        return !!(obj as ColorFulCircle).radius;
    }

    public instanceOfColorFulRectangle(obj:any): obj is ColorFulRectangle{
        return !!((obj as ColorFulRectangle).width && (obj as ColorFulRectangle).height);
    }

    public instanceOfColorFulSquare(obj:any): obj is ColorFulSquare{
        return !!(obj as ColorFulSquare).size;
    }
}


// var test: Circle | Rectangle = {
// }