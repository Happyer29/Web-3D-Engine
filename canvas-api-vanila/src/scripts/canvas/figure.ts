import Color from 'ts-color-class';

export interface Vector {
    x: number,
    y: number
}

interface Circle {
    type: "circle",
    radius: number,
    position: Vector,
}

export interface Rectangle {
    type: "rectangle",
    width: number,
    height: number,
    position: Vector
}

export interface colorString {
    color: any
}

interface ColorInterface {
    color: Color
}

// export type ColorFulCircle = Circle & ColorInterface;
// type ColorFulRectangle = Rectangle & ColorInterface;
type figure = Circle | Rectangle;
export type colorFulFigure = figure & ColorInterface;

export type colorFulCircle = Circle & ColorInterface;
export type colorFulRectangle = Rectangle & ColorInterface;


export class Figure {
    private readonly _info: colorFulFigure;
    private _moveTo: Vector;

    constructor(figure: colorFulFigure) {
        this._info = figure;
        this._moveTo = {x: null, y: null}
    }

    get type() {
        return this._info.type;
    }

    get info() {
        return this._info;
    }

    get position() {
        return this._info.position
    }

    public setPosition(position: Vector) {
        this._info.position = position;
    }

    set color(color: string) {
        this._info.color = color;
    }

    get color() {
        return this._info.color;
    }

    get getMoveTo(){
        return this._moveTo;
    }

    public moveTo(position: Vector){
        this._moveTo = position;
    }
}