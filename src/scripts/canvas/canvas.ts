import {Figure} from "./figure";
import {FigureController} from "./figureController";

export class Canvas extends FigureController {
    private readonly _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private readonly _canvasWidth: number = 0;
    private readonly _canvasHeight: number = 0;


    private _fps: number = 60;

    constructor(selector: string) {
        super();
        this._canvas = <HTMLCanvasElement>document.querySelector(selector)
        this._ctx = this._canvas.getContext('2d');
        this._canvas.width = document.body.clientWidth; //document.width is obsolete
        this._canvas.height = document.body.clientHeight
        this._canvasWidth = this._canvas.width;
        this._canvasHeight = this._canvas.height;
    }


    get ctx() {
        return this._ctx;
    }

    public addFigure(figure: Figure) {
        super.addFigure(this._ctx, figure);
    }

    public getFigures(): Array<Figure> {
        return super.getFigures();
    }

    public render() {
        setTimeout(() => {
            this.clear();
            super.drawAllFigures(this._ctx, this.frameDelay);
            this.render();
            console.log("tick");
        }, this.frameDelay);
    }

    get frameDelay() {
        return 1000 / this._fps;
        //return 2000;
    }

    private clear() {
        this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    }


}