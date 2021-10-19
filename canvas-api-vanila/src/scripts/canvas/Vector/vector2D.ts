import {Vector, vectorCreate} from "./vectorClass";

export class Vector2D extends Vector{
    constructor(v: vectorCreate) {
        super(v, 2);
    }

    get position(){
        return {
            x: this._x,
            y: this._y
        }
    }

    protected getUnitVector(){
        return {
            x: this._x/this.length(),
            y: this._y/this.length()
        };
    }
}