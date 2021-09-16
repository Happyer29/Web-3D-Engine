import {Figure, Rectangle, colorString, Circle} from "./figure";
import Color from "ts-color-class";

export class Canvas{
    private readonly canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private readonly canvasWidth: number = 0;
    private readonly canvasHeight: number = 0;

    private figureObj;

    constructor(selector: string){
        this.canvas = <HTMLCanvasElement> document.querySelector(selector)
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
    }

    public addCircle(figure: Circle & colorString){
        figure.color = new Color(figure.color as string);
        let tmp = new Figure();
        tmp.createCircle(this.ctx, figure);
        tmp.render(this.ctx);
    }

    public addRectangle(figure: Rectangle & colorString){
        figure.color = new Color(figure.color as string);
        let tmp = new Figure();
        tmp.createRectangle(this.ctx, figure);
        tmp.render(this.ctx);
    }

    // public animateTo(ctx:CanvasRenderingContext2D, figure: ColorFulCircle | ColorFulRectangle | ColorFulSquare){
    //     let i = 0;
    //     setInterval(()=>{
    //         i++;
    //         ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    //         ctx.rect(i, i, 100, 100);
    //     }, 20)
    // }
}