import { Vector3 } from "../maths/Vector3";

export class Light {

    protected _shininess: number = 100;
    private _color: Vector3 = new Vector3([1, 1, 1]);
    
    public get color(): Vector3 {
        return this._color;
    }
    public set color(value: Vector3) {
        this._color = value;
    }
    protected _type: String;

    public get type(): String {
        return this._type;
    }
    public set type(value: String) {
        this._type = value;
    }

    constructor(shininess?: number, color?: Vector3) {
        if (shininess) this._shininess = shininess;
        if (color) this._color = color;
    }

    public get shininess(): number {
        return this._shininess;
    }
    public set shininess(value: number) {
        this._shininess = value;
    }

}