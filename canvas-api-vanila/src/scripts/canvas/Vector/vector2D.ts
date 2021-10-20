import {vector, Vector} from "./vectorClass";

export class Vector2D extends Vector{
    constructor(v: vector) {
        super(v);
    }
    // protected getUnitVector(){
    //     return {
    //         x: this._x/this.length(),
    //         y: this._y/this.length()
    //     };
    // }
}