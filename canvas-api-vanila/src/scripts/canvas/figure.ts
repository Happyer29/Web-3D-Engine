import * as Color from 'color';
interface circle{
    radius: number
}

interface rectangle{
    width: number,
    height: number
}

interface square {
    size: number
}

interface colorInterface {
    color: Color
}

type colorFulCircle = circle & colorInterface;
type colorFulRectangle = rectangle & colorInterface;
type colorFulSquare = square & colorInterface;


type figureType = (circle | rectangle | square) & colorInterface;


export class figure{
    private canvas: HTMLCanvasElement;
    constructor(selector: string) {
        this.canvas = <HTMLCanvasElement> document.querySelector(selector);
    }

    public createFigure(figure:colorFulCircle){
        let ctx:CanvasRenderingContext2D = this.canvas.getContext('2d')
        ctx.save();
        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
        ctx.fillStyle = new Color(figure.color).string();
        return ctx;
    }

    public render(ctx:CanvasRenderingContext2D): void{
        ctx.fill();
    }
}


// var test: circle | rectangle = {
// }