import { vector3, Vector3 } from "../maths/Vector3";
import { Light } from "./Light";

export class PointLight extends Light {
    private _position: Vector3 = new Vector3([0, 0, 0]);
    constructor(position?: vector3, shininess?: number, color?: Vector3) {
        super();
        if (position) this._position = new Vector3(position);
        if (shininess) this._shininess = shininess;
        if (color) this.color = color;
        this.type = "PointLight";
    }

    public get position(): Vector3 {
        return this._position;
    }
    public set position(value: Vector3) {
        this._position = value;
    }
}