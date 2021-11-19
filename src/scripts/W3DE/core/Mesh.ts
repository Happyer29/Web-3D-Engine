import {Material} from "./Material";
import {Geometry} from "./Geometry";

export class Mesh {
    private _geometry: Geometry;
    private material: Material;

    constructor(geometry: Geometry, material: Material) {
        this._geometry = geometry;
        this.material = material;
    }


    get geometry(): Geometry {
        return this._geometry;
    }
}