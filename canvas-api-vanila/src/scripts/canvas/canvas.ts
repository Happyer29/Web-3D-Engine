import {colorFulFigure, figure, Figure} from "./figure";
import {FigureController} from "./figureController";
export class Canvas extends FigureController{
    private readonly _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private readonly _canvasWidth: number = 0;
    private readonly _canvasHeight: number = 0;

    private _fps: number = 30;
    constructor(selector: string){
        super();
        this._canvas = <HTMLCanvasElement> document.querySelector(selector)
        this._ctx = this._canvas.getContext('2d');
        this._canvasWidth = this._canvas.width;
        this._canvasHeight = this._canvas.height;
    }

    get ctx(){
        return this._ctx;
    }

    public addFigure(figure:colorFulFigure){
        super.addFigure(this._ctx, figure);
    }

    public getFigures():Array<figure>{
        return super.getFigures();
    }

    public render(){
        setTimeout(()=>{
            this.clear();
            super.drawAllFigures(this._ctx);
            this.render();
            console.log("tick");
        }, this.frameDelay);
    }

    get frameDelay(){
        return 1000/this._fps;
    }

    private clear(){
        this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    }


    // public addCircle(figure: Circle & colorString){
    //     figure.color = new Color(figure.color as string);
    //     let tmp = new Figure();
    //     tmp.createCircle(this.ctx, figure);
    //     tmp.render(this.ctx);
    // }
    //
    // public addRectangle(figure: Rectangle & colorString){
    //     figure.color = new Color(figure.color as string);
    //     let tmp = new Figure();
    //     tmp.createRectangle(this.ctx, figure);
    //     tmp.render(this.ctx);
    // }
    //
    // public animateTo<T extends PositionObj>(figure: T){
    //     if(figure.position.x){
    //         console.log("test");
    //     }
    // }

    // public animateTo(ctx:CanvasRenderingContext2D, figure: ColorFulCircle | ColorFulRectangle | ColorFulSquare){
    //     let i = 0;
    //     setInterval(()=>{
    //         i++;
    //         ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    //         ctx.rect(i, i, 100, 100);
    //     }, 20)
    // }
}