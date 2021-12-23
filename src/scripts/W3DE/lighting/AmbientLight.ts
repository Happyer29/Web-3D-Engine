import { Vector3 } from "../maths/Vector3";
import { Light } from "./Light";

export class AmbientLight extends Light {
    
    constructor(shininess?: number, color?: Vector3) {
        super()
        if (shininess) this._shininess = shininess;
        if (color) this.color = color;
        this.type = "AmbientLight";
    }
}