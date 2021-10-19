import {Vector, vectorCreate} from "./vectorClass";

export class Vector3D extends Vector{
    constructor(v: vectorCreate) {
        super(v, 3);
    }

    get position(){
        return {
            x: this._x,
            y: this._y,
            z: this._z
        }
    }

    public getUnitVector(){
        return {
            x: this._x/this.length(),
            y: this._y/this.length(),
            z: this._z/this.length()
        };
    }
}